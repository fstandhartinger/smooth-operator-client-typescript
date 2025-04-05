import { MechanismType, ScreenGrasp2Response, ScreenshotResponse } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for screenshot and analysis operations
 */
export class ScreenshotApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the ScreenshotApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Captures a screenshot of the entire screen as Base64-encoded image
   * @returns Screenshot response containing ImageBase64 property
   */
  public async take(): Promise<ScreenshotResponse> {
    return this.client.get<ScreenshotResponse>('/tools-api/screenshot');
  }

  /**
   * Uses AI to find the x/y coordinate of a UI element based on text description. Takes a fresh screenshot each time.
   * @param userElementDescription Text description of the element to find
   * @param mechanism The AI mechanism to use for finding the element (defaults to ScreenGrasp2)
   * @returns Response with X/Y coordinates
   */
  public async findUiElement(
    userElementDescription: string,
    mechanism: MechanismType = MechanismType.ScreenGrasp2
  ): Promise<ScreenGrasp2Response> {
    return this.client.post<ScreenGrasp2Response>('/tools-api/screenshot/find-ui-element', {
      taskDescription: userElementDescription,
      mechanism: mechanism
    });
  }

  /**
   * Returns a string representation of the ScreenshotApi class.
   * @returns The string "ScreenshotApi".
   */
  public toString(): string {
    return 'ScreenshotApi';
  }
}
