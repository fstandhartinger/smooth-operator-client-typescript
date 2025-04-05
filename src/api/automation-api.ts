import { ActionResponse, SimpleResponse, WindowDetailInfosDTO } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for Windows automation operations
 */
export class AutomationApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the AutomationApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Launches an application by path or name
   * @param appNameOrPath Full path to executable or application name, alternatively exe name if in path (e.g. notepad, calc)
   * @returns SimpleResponse indicating success or failure
   */
  public async openApplication(appNameOrPath: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/system/open-application', { appNameOrPath });
  }

  /**
   * Invokes default action on Windows UI element (e.g. click button)
   * @param elementId Element ID from getOverview/getWindowDetails
   * @returns SimpleResponse indicating success or failure
   */
  public async invoke(elementId: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/automation/invoke', { elementId });
  }

  /**
   * Set the value of a UI element
   * @param elementId ID of the UI element
   * @param value Value to set
   * @returns SimpleResponse indicating success or failure
   */
  public async setValue(elementId: string, value: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/automation/set-value', { elementId, value });
  }

  /**
   * Set focus to a UI element
   * @param elementId ID of the UI element
   * @returns SimpleResponse indicating success or failure
   */
  public async setFocus(elementId: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/automation/set-focus', { elementId });
  }

  /**
   * Gets detailed UI automation information for a window
   * @param windowId Window ID from getOverview
   * @returns WindowDetailInfosDTO with element hierarchy and properties
   */
  public async getWindowDetails(windowId: string): Promise<WindowDetailInfosDTO> {
    return this.client.post<WindowDetailInfosDTO>('/tools-api/automation/get-details', { windowId });
  }

  /**
   * Bring a window to the front
   * @param windowId ID of the window
   * @returns SimpleResponse indicating success or failure
   */
  public async bringToFront(windowId: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/automation/bring-to-front', { windowId });
  }

  /**
   * Find and click a Windows UI element by description
   * @param description Description of the UI element
   * @returns Action response
   */
  public async clickElement(description: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/automation/click-element', { description });
  }

  /**
   * Find a Windows UI element by description and type text into it
   * @param description Description of the UI element
   * @param text Text to type
   * @returns Action response
   */
  public async typeInElement(description: string, text: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/automation/type-in-element', { description, text });
  }

  /**
   * Get text from a Windows UI element by description
   * @param description Description of the UI element
   * @returns Action response with element text
   */
  public async getElementText(description: string): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/automation/get-element-text', { description });
  }

  /**
   * Returns a string representation of the AutomationApi class.
   * @returns The string "AutomationApi".
   */
  public toString(): string {
    return 'AutomationApi';
  }
}
