import { ActionResponse, ChromeScriptResponse, ChromeTabDetails, SimpleResponse } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for Chrome browser operations
 */
export class ChromeApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the ChromeApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Opens Chrome browser (Playwright-managed instance)
   * @param url Optional URL to navigate to immediately
   * @param strategy Optional strategy for opening Chrome
   * @returns SimpleResponse indicating success or failure
   */
  public async openChrome(url?: string, strategy?: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/system/open-chrome', { url, strategy });
  }

  /**
   * Gets detailed analysis of current Chrome tab including interactive elements
   * @returns ChromeTabDetails with CSS selectors for key elements
   */
  public async explainCurrentTab(): Promise<ChromeTabDetails> {
    return this.client.post<ChromeTabDetails>('/tools-api/chrome/current-tab/explain', {});
  }

  /**
   * Navigate to a URL in the current Chrome tab
   * @param url URL to navigate to
   * @returns Action response
   */
  public async navigate(url: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/navigate', { url });
  }

  /**
   * Reload the current Chrome tab
   * @returns Action response
   */
  public async reload(): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/reload', {});
  }

  /**
   * Open a new Chrome tab
   * @param url Optional URL to navigate to
   * @returns Action response
   */
  public async newTab(url?: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/new-tab', { url });
  }

  /**
   * Clicks element in Chrome tab using CSS selector
   * @param selector CSS selector from explainCurrentTab
   * @returns Action response with success status
   */
  public async clickElement(selector: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/click-element', { selector });
  }

  /**
   * Navigate back in the current Chrome tab
   * @returns Action response
   */
  public async goBack(): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/go-back', {});
  }

  /**
   * Simulate input in an element in the current Chrome tab
   * @param selector CSS selector of the element to input text into
   * @param text Text to input
   * @returns Action response
   */
  public async simulateInput(selector: string, text: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/simulate-input', { selector, text });
  }

  /**
   * Get the DOM of the current Chrome tab
   * @returns Action response with DOM content
   */
  public async getDom(): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/get-dom', {});
  }

  /**
   * Get the text content of the current Chrome tab
   * @returns Action response with text content
   */
  public async getText(): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/chrome/get-text', {});
  }

  /**
   * Executes JavaScript in Chrome tab and returns result
   * @param script JavaScript code to run
   * @returns ChromeScriptResponse with execution result
   */
  public async executeScript(script: string): Promise<ChromeScriptResponse> {
    return this.client.post<ChromeScriptResponse>('/tools-api/chrome/execute-script', { script });
  }

  /**
   * Generate and execute JavaScript based on a description
   * @param taskDescription Description of what the JavaScript should do
   * @returns ChromeScriptResponse with execution result
   */
  public async generateAndExecuteScript(taskDescription: string): Promise<ChromeScriptResponse> {
    return this.client.post<ChromeScriptResponse>('/tools-api/chrome/generate-and-execute-script', { taskDescription });
  }

  /**
   * Returns a string representation of the ChromeApi class.
   * @returns The string "ChromeApi".
   */
  public toString(): string {
    return 'ChromeApi';
  }
}
