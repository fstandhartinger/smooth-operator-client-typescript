import { ScreenshotApi } from '../src/api/screenshot-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';
import { MechanismType } from '../src/models/interfaces';

describe('ScreenshotApi', () => {
  let screenshotApi: ScreenshotApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      get: jest.fn().mockResolvedValue({ success: true, imageBase64: 'test-image-data' }),
      post: jest.fn().mockResolvedValue({ success: true, x: 100, y: 200 })
    } as unknown as SmoothOperatorClient;
    
    screenshotApi = new ScreenshotApi(mockClient);
  });
  
  test('should take screenshot', async () => {
    const result = await screenshotApi.take();
    
    expect(mockClient.get).toHaveBeenCalledWith('/tools-api/screenshot');
    expect(result).toEqual({ success: true, imageBase64: 'test-image-data' });
  });
  
  test('should find UI element', async () => {
    const result = await screenshotApi.findUiElement('Submit button');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/screenshot/find-ui-element', {
      taskDescription: 'Submit button',
      mechanism: MechanismType.ScreenGrasp2
    });
    expect(result).toEqual({ success: true, x: 100, y: 200 });
  });
  
  test('should find UI element with custom mechanism', async () => {
    const result = await screenshotApi.findUiElement('Submit button', MechanismType.LLabs);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/screenshot/find-ui-element', {
      taskDescription: 'Submit button',
      mechanism: MechanismType.LLabs
    });
    expect(result).toEqual({ success: true, x: 100, y: 200 });
  });
  
  test('should return string representation', () => {
    expect(screenshotApi.toString()).toBe('ScreenshotApi');
  });
});
