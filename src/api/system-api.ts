import { ActionResponse, MechanismType, OverviewResponse, SimpleResponse, WindowDetailInfosDTO } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for system operations
 */
export class SystemApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the SystemApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Gets detailed overview of computer state including open applications and windows
   * @returns OverviewResponse with FocusInfo, Windows array and Chrome details
   */
  public async getOverview(): Promise<OverviewResponse> {
    return this.client.post<OverviewResponse>('/tools-api/system/overview', {});
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
   * Opens Chrome browser (Playwright-managed instance)
   * @param url Optional URL to navigate to immediately
   * @param strategy Optional strategy for opening Chrome
   * @returns SimpleResponse indicating success or failure
   */
  public async openChrome(url?: string, strategy?: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/system/open-chrome', { url, strategy });
  }

  /**
   * Launches an application by path or name
   * @param appNameOrPath Full path to executable or application name, alternatively exe name if in path (e.g. notepad, calc). For chrome don't use this, use openChrome instead.
   * @returns SimpleResponse indicating success or failure
   */
  public async openApplication(appNameOrPath: string): Promise<SimpleResponse> {
    return this.client.post<SimpleResponse>('/tools-api/system/open-application', { appNameOrPath });
  }

  /**
   * Returns a string representation of the SystemApi class.
   * @returns The string "SystemApi".
   */
  public toString(): string {
    return 'SystemApi';
  }
}
