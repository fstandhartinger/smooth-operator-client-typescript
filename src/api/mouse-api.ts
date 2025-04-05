import { ActionResponse, MechanismType } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for mouse operations
 */
export class MouseApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the MouseApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Performs left mouse click at screen coordinates (0,0 is top-left)
   * @param x Horizontal pixel coordinate
   * @param y Vertical pixel coordinate
   * @returns Action response with success status
   */
  public async click(x: number, y: number): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/click', { x, y });
  }

  /**
   * Perform a double click at the specified coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Action response
   */
  public async doubleClick(x: number, y: number): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/doubleclick', { x, y });
  }

  /**
   * Perform a right mouse button click at the specified coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Action response
   */
  public async rightClick(x: number, y: number): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/rightclick', { x, y });
  }

  /**
   * Move the mouse cursor to the specified coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Action response
   */
  public async move(x: number, y: number): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/move', { x, y });
  }

  /**
   * Perform a mouse drag operation from start coordinates to end coordinates
   * @param startX Start X coordinate
   * @param startY Start Y coordinate
   * @param endX End X coordinate
   * @param endY End Y coordinate
   * @returns Action response
   */
  public async drag(startX: number, startY: number, endX: number, endY: number): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/drag', { startX, startY, endX, endY });
  }

  /**
   * Scrolls mouse wheel at specified coordinates
   * @param x Horizontal pixel coordinate
   * @param y Vertical pixel coordinate
   * @param clicks Number of scroll clicks (positive for down, negative for up)
   * @param direction Direction to scroll ("up" or "down"). Overrides clicks sign if provided.
   * @returns Action response with success status
   */
  public async scroll(x: number, y: number, clicks: number, direction?: string): Promise<ActionResponse> {
    // Map clicks to server's expectation (positive=down, negative=up) if direction is null
    if (direction === undefined) {
      direction = clicks > 0 ? "down" : "up";
      clicks = Math.abs(clicks);
    } else {
      clicks = Math.abs(clicks); // Ensure clicks is positive when direction is specified
    }
    return this.client.post<ActionResponse>('/tools-api/mouse/scroll', { x, y, clicks, direction });
  }

  /**
   * Uses AI vision to find and click a UI element based on description (consumes 50-100 tokens)
   * @param userElementDescription Natural language description of element (be specific and include unique identifiers)
   * @param mechanism The AI mechanism to use for finding the element (defaults to ScreenGrasp2)
   * @returns Action response with success status and coordinates
   */
  public async clickByDescription(
    userElementDescription: string,
    mechanism: MechanismType = MechanismType.ScreenGrasp2
  ): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/click-by-description', {
      taskDescription: userElementDescription,
      mechanism: mechanism
    });
  }

  /**
   * Uses AI vision to find and double-click a UI element based on description (consumes 50-100 tokens)
   * @param userElementDescription Natural language description of element (be specific and include unique identifiers)
   * @param mechanism The AI mechanism to use for finding the element (defaults to ScreenGrasp2)
   * @returns Action response with success status and coordinates
   */
  public async doubleClickByDescription(
    userElementDescription: string,
    mechanism: MechanismType = MechanismType.ScreenGrasp2
  ): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/doubleclick-by-description', {
      taskDescription: userElementDescription,
      mechanism: mechanism
    });
  }

  /**
   * Uses AI vision to drag from source to target elements based on descriptions (consumes 100-200 tokens)
   * @param startElementDescription Natural language description of source element
   * @param endElementDescription Natural language description of target element
   * @returns Action response with success status and coordinates
   */
  public async dragByDescription(
    startElementDescription: string,
    endElementDescription: string
  ): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/drag-by-description', {
      startElementDescription,
      endElementDescription
    });
  }

  /**
   * Uses AI vision to find and right-click a UI element based on description (consumes 50-100 tokens)
   * @param userElementDescription Natural language description of element (be specific and include unique identifiers)
   * @param mechanism The AI mechanism to use for finding the element (defaults to ScreenGrasp2)
   * @returns Action response with success status and coordinates
   */
  public async rightClickByDescription(
    userElementDescription: string,
    mechanism: MechanismType = MechanismType.ScreenGrasp2
  ): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/rightclick-by-description', {
      taskDescription: userElementDescription,
      mechanism: mechanism
    });
  }

  /**
   * Uses AI vision to move mouse cursor to element based on description (consumes 50-100 tokens)
   * @param userElementDescription Natural language description of element (be specific and include unique identifiers)
   * @param mechanism The AI mechanism to use for finding the element (defaults to ScreenGrasp2)
   * @returns Action response with success status and coordinates
   */
  public async moveByDescription(
    userElementDescription: string,
    mechanism: MechanismType = MechanismType.ScreenGrasp2
  ): Promise<ActionResponse> {
    return this.client.post<ActionResponse>('/tools-api/mouse/move-by-description', {
      taskDescription: userElementDescription,
      mechanism: mechanism
    });
  }

  /**
   * Returns a string representation of the MouseApi class.
   * @returns The string "MouseApi".
   */
  public toString(): string {
    return 'MouseApi';
  }
}
