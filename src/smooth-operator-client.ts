import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs'; // Keep fs for port file handling and path checks
import * as path from 'path';
import * as os from 'os';
import * as http from 'http';
import { promisify } from 'util'; // Keep promisify for fs functions

import { ScreenshotApi } from './api/screenshot-api';
import { SystemApi } from './api/system-api';
import { MouseApi } from './api/mouse-api';
import { KeyboardApi } from './api/keyboard-api';
import { ChromeApi } from './api/chrome-api';
import { AutomationApi } from './api/automation-api';
import { CodeApi } from './api/code-api';

// Promisify fs functions needed for startServer
const fsExists = promisify(fs.exists);
const fsReadFile = promisify(fs.readFile);
const fsUnlink = promisify(fs.unlink);
const LOG_PREFIX = 'Smooth Operator Client:'; // Define the log prefix

// Helper function to recursively convert object keys to camelCase
function keysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    // If it's an array, map over its elements and apply the function recursively
    return obj.map(v => keysToCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    // If it's a plain object, reduce its keys to create a new object with camelCase keys
    return Object.keys(obj).reduce((result, key) => {
      // Convert the first character to lower case
      const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
      // Recursively apply the function to the value
      result[camelCaseKey] = keysToCamelCase(obj[key]);
      return result;
    }, {} as any); // Start with an empty object
  }
  // Return primitives and non-plain objects as is
  return obj;
}

/**
 * Main client for the Smooth Operator Agent Tools API
 */
export class SmoothOperatorClient {
  private static readonly LOG_TIMING = true;

  private httpClient: typeof http;
  private baseUrl: string | null = null;
  private serverProcess: ChildProcess | null = null;
  private disposed = false;
  private apiKey: string | null = null; // Added to store API key
  // Removed installationFolderPromise
  /**
   * Screenshot and analysis operations
   */
  public screenshot: ScreenshotApi;

  /**
   * System operations
   */
  public system: SystemApi;

  /**
   * Mouse operations
   */
  public mouse: MouseApi;

  /**
   * Keyboard operations
   */
  public keyboard: KeyboardApi;

  /**
   * Chrome browser operations
   */
  public chrome: ChromeApi;

  /**
   * Windows automation operations
   */
  public automation: AutomationApi;

  /**
   * Code execution operations
   */
  public code: CodeApi;

  // Removed static initializer block for installation

  /**
   * Creates a new instance of the SmoothOperatorClient
   * @param apiKey Optional: API key for authentication. Most methods don't require an API Key, but for some, especially the ones that use AI, you need to provide a Screengrasp.com API Key
   * @param baseUrl Optional: Base URL of the API. By Default the url is automatically determined by calling startServer(), alternatively you can also just point to an already running Server instance by providing its base url here.
   */
  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || null; // Store the API key
    this.baseUrl = baseUrl || null;
    this.httpClient = http;

    // Initialize API categories
    this.screenshot = new ScreenshotApi(this);
    this.system = new SystemApi(this);
    this.mouse = new MouseApi(this);
    this.keyboard = new KeyboardApi(this);
    this.chrome = new ChromeApi(this);
    this.automation = new AutomationApi(this);
    this.code = new CodeApi(this);
  }

  /**
   * Starts the Smooth Operator Agent Tools Server
   * @throws Error when server is already running or base URL is already set manually
   * @throws Error when server files cannot be extracted or accessed
   */
  public async startServer(): Promise<void> {
    if (this.baseUrl !== null) {
      throw new Error("Cannot start server when base URL has been already set.");
    }
    
    if (SmoothOperatorClient.LOG_TIMING) {
      console.log(`${new Date().toISOString()} - Starting server...`);
    }

   // Determine installation folder path (assuming postinstall script ran)
   const installationFolder = SmoothOperatorClient.getInstallationFolder();
   if (!(await fsExists(installationFolder))) {
       // This should ideally not happen if postinstall ran correctly
       throw new Error(`Installation folder not found at ${installationFolder}. Please ensure the package installed correctly.`);
   }

   if (SmoothOperatorClient.LOG_TIMING) {
     console.log(`${new Date().toISOString()} - Using installation folder: ${installationFolder}`);
   }

    // Generate random port number filename
    const random = Math.floor(Math.random() * (100000000 - 1000000) + 1000000);
    const portNumberFileName = `portnr_${random}.txt`;
    const portNumberFilePath = path.join(installationFolder, portNumberFileName);

    // Delete the port number file if it exists from a previous run
    if (await fsExists(portNumberFilePath)) {
      await fsUnlink(portNumberFilePath);
    }

    // Start the server process
    const serverExePath = path.join(installationFolder, 'smooth-operator-server.exe');
    const args = [
      '/silent',
      '/close-with-parent-process',
      '/managed-by-lib',
      '/apikey=no_api_key_provided',
      `/portnrfile=${portNumberFileName}`
    ];

    // On non-Windows platforms, use Wine to run the .exe
    const isWindows = process.platform === 'win32';
    let spawnCommand: string;
    let spawnArgs: string[];

    if (isWindows) {
      spawnCommand = serverExePath;
      spawnArgs = args;
    } else {
      spawnCommand = 'wine';
      spawnArgs = [serverExePath, ...args];
    }

    this.serverProcess = spawn(spawnCommand, spawnArgs, {
      cwd: installationFolder,
      detached: false
    });

    if (!this.serverProcess || !this.serverProcess.pid) {
      throw new Error("Failed to start the server process.");
    }

    if (SmoothOperatorClient.LOG_TIMING) {
      console.log(`${new Date().toISOString()} - Server process started.`);
    }

    // Wait for the port number file to be created
    const maxWaitTimeMs = 30000; // 30 seconds max wait
    let waitedMs = 0;
    
    while (!(await fsExists(portNumberFilePath)) && waitedMs < maxWaitTimeMs) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitedMs += 100;
    }

    if (!(await fsExists(portNumberFilePath))) {
      this.stopServer();
      throw new Error("Server failed to report port number within the timeout period.");
    }

    // Read the port number
    const portNumber = (await fsReadFile(portNumberFilePath, 'utf8')).trim();
    this.baseUrl = `http://localhost:${portNumber}`;
    await fsUnlink(portNumberFilePath);

    if (SmoothOperatorClient.LOG_TIMING) {
      console.log(`${new Date().toISOString()} - Server reported back it is running at port ${portNumber}.`);
    }

    // Check if server is running
    waitedMs = 0;
    while (true) {
      const startTime = Date.now();
      try {
        const result = await this.get<string>('/tools-api/ping');
        if (result === 'pong') {
          break; // Server is ready for requests
        }
      } catch {
        // No problem, just means server is not ready yet
      }
      
      const elapsedMs = Date.now() - startTime;
      waitedMs += elapsedMs;
      
      if (waitedMs > maxWaitTimeMs) {
        throw new Error("Server failed to become responsive within the timeout period.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      waitedMs += 100;
      
      if (waitedMs > maxWaitTimeMs) {
        throw new Error("Server failed to become responsive within the timeout period.");
      }
    }

    if (SmoothOperatorClient.LOG_TIMING) {
      console.log(`${new Date().toISOString()} - Server ping successful, server is running.`);
    }
  }

 /**
  * Helper method to get the expected installation folder path.
  * This logic should match the postinstall script.
  * @returns The installation folder path
  */
 private static getInstallationFolder(): string {
   let appDataBase: string;
   const platform = os.platform();
   if (platform === 'win32') {
       appDataBase = process.env.APPDATA || path.join(os.homedir(), '.smooth-operator-data'); // Use APPDATA or fallback
   } else {
       // Fallback for non-windows (macOS/Linux) - matches postinstall script
       appDataBase = path.join(os.homedir(), '.smooth-operator-data');
       console.warn(`${LOG_PREFIX} Unsupported platform: ${platform}. Using fallback installation directory: ${appDataBase}`);
   }
   return path.join(appDataBase, 'SmoothOperator', 'AgentToolsServer');
 }

  /**
   * Stops the Smooth Operator Agent Tools Server if it was started by this client
   */
  public stopServer(): void {
    if (this.serverProcess && !this.serverProcess.killed) {
      try {
        this.serverProcess.kill();
        // Wait up to 5 seconds for the process to exit
        const exitPromise = new Promise<void>((resolve) => {
          if (this.serverProcess) {
            this.serverProcess.on('exit', () => resolve());
            setTimeout(resolve, 5000);
          } else {
            resolve();
          }
        });
        
        // We don't await this promise since stopServer is synchronous
        exitPromise.then(() => {
          if (this.serverProcess) {
            this.serverProcess = null;
          }
        });
      } catch (error) {
        // Ignore errors when trying to kill the process
      }
    }
  }

  /**
   * Sends a GET request to the specified endpoint
   * @param endpoint API endpoint
   * @returns Deserialized response
   */
  public async get<T>(endpoint: string): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("BaseUrl is not set. You must call startServer() first, or provide a baseUrl in the constructor.");
    }

    return new Promise<T>((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const options = {
        headers: {} as Record<string, string>
      };
      if (this.apiKey) {
        options.headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const req = http.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const rawResult = JSON.parse(data);
              // Convert keys from PascalCase (C#) to camelCase (TS) before resolving
              const result = keysToCamelCase(rawResult);
              resolve(result);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          } else {
            reject(new Error(`Request failed with status code ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }

  /**
   * Sends a POST request to the specified endpoint
   * @param endpoint API endpoint
   * @param data Request data
   * @returns Deserialized response
   */
  public async post<T>(endpoint: string, data: any = null): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("BaseUrl is not set. You must call startServer() first, or provide a baseUrl in the constructor.");
    }

    return new Promise<T>((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const postData = JSON.stringify(data || {});

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } as Record<string, string | number>
      };

      if (this.apiKey) {
        options.headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const req = http.request(url, options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const rawResult = JSON.parse(responseData);
              // Convert keys from PascalCase (C#) to camelCase (TS) before resolving
              const result = keysToCamelCase(rawResult);
              resolve(result);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          } else {
            reject(new Error(`Request failed with status code ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(postData); // Explicitly write the data
      req.end(); // Finalize the request
    });
  }
}