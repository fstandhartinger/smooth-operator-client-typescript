import { ActionResponse } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for keyboard operations
 */
export class KeyboardApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the KeyboardApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Type text at the current cursor position
   * @param text Text to type
   * @returns Action response
   */
  public async type(text: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/keyboard/type', { text });
  }

  /**
   * Presses key or hotkey combination (e.g. "Ctrl+C" or "Alt+F4")
   * @param key Key name or combination
   * @returns Action response with success status
   */
  public async press(key: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/keyboard/press', { key });
  }

  /**
   * Find a UI element based on a text description and type text into it
   * @param elementDescription Text description of the UI element
   * @param textToType Text to type
   * @returns Action response
   */
  public async typeAtElement(elementDescription: string, textToType: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/keyboard/type-at-element', { 
      elementDescription, 
      textToType 
    });
  }

  /**
   * Returns a string representation of the KeyboardApi class.
   * @returns The string "KeyboardApi".
   */
  public toString(): string {
    return 'KeyboardApi';
  }
}
