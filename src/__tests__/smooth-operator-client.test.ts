import { SmoothOperatorClient } from '../src/smooth-operator-client';
import * as http from 'http';

// Mock the http module
jest.mock('http');
jest.mock('child_process', () => ({
  spawn: jest.fn().mockReturnValue({
    pid: 12345,
    killed: false,
    kill: jest.fn(),
    on: jest.fn((event, callback) => callback())
  })
}));
jest.mock('fs', () => ({
  exists: jest.fn((path, callback) => callback(null, true)),
  readFile: jest.fn((path, encoding, callback) => {
    if (path.includes('portnr_')) {
      callback(null, '12345');
    } else {
      callback(null, '1.0.33');
    }
  }),
  writeFile: jest.fn((path, content, callback) => callback(null)),
  mkdir: jest.fn((path, options, callback) => callback(null)),
  unlink: jest.fn((path, callback) => callback(null))
}));

describe('SmoothOperatorClient', () => {
  let client: SmoothOperatorClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock http.get for ping
    (http.get as jest.Mock).mockImplementation((url, callback) => {
      const res = {
        statusCode: 200,
        on: jest.fn((event, cb) => {
          if (event === 'data') cb('"pong"');
          if (event === 'end') cb();
          return res;
        })
      };
      callback(res);
      return {
        on: jest.fn(),
        end: jest.fn()
      };
    });
    
    // Mock http.request for other calls
    (http.request as jest.Mock).mockImplementation((url, options, callback) => {
      const res = {
        statusCode: 200,
        on: jest.fn((event, cb) => {
          if (event === 'data') cb('{"success":true}');
          if (event === 'end') cb();
          return res;
        })
      };
      callback(res);
      return {
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn()
      };
    });
    
    client = new SmoothOperatorClient('test-api-key');
  });
  
  test('should initialize API categories', () => {
    expect(client.screenshot).toBeDefined();
    expect(client.system).toBeDefined();
    expect(client.mouse).toBeDefined();
    expect(client.keyboard).toBeDefined();
    expect(client.chrome).toBeDefined();
    expect(client.automation).toBeDefined();
    expect(client.code).toBeDefined();
  });
  
  test('should start server successfully', async () => {
    await client.startServer();
    expect(client['baseUrl']).toBe('http://localhost:12345');
  });
  
  test('should throw error when starting server with baseUrl already set', async () => {
    client = new SmoothOperatorClient('test-api-key', 'http://localhost:8080');
    await expect(client.startServer()).rejects.toThrow('Cannot start server when base URL has been already set');
  });
  
  test('should make GET request successfully', async () => {
    client = new SmoothOperatorClient('test-api-key', 'http://localhost:8080');
    const result = await client.get('/test-endpoint');
    expect(result).toBeDefined();
  });
  
  test('should make POST request successfully', async () => {
    client = new SmoothOperatorClient('test-api-key', 'http://localhost:8080');
    const result = await client.post('/test-endpoint', { test: 'data' });
    expect(result).toBeDefined();
  });
  
  test('should throw error when making request without baseUrl', async () => {
    await expect(client.get('/test-endpoint')).rejects.toThrow('BaseUrl is not set');
    await expect(client.post('/test-endpoint')).rejects.toThrow('BaseUrl is not set');
  });
  
  test('should stop server when dispose is called', () => {
    client['serverProcess'] = {
      pid: 12345,
      killed: false,
      kill: jest.fn(),
      on: jest.fn()
    } as any;
    
    client.dispose();
    expect(client['serverProcess']?.kill).toHaveBeenCalled();
    expect(client['disposed']).toBe(true);
  });
});
