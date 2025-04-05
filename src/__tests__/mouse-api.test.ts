import { MouseApi } from '../src/api/mouse-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';
import { MechanismType } from '../src/models/interfaces';

describe('MouseApi', () => {
  let mouseApi: MouseApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    } as unknown as SmoothOperatorClient;
    
    mouseApi = new MouseApi(mockClient);
  });
  
  test('should click at coordinates', async () => {
    const result = await mouseApi.click(100, 200);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/click', {
      x: 100,
      y: 200
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should double click at coordinates', async () => {
    const result = await mouseApi.doubleClick(100, 200);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/doubleclick', {
      x: 100,
      y: 200
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should right click at coordinates', async () => {
    const result = await mouseApi.rightClick(100, 200);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/rightclick', {
      x: 100,
      y: 200
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should move to coordinates', async () => {
    const result = await mouseApi.move(100, 200);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/move', {
      x: 100,
      y: 200
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should drag from start to end coordinates', async () => {
    const result = await mouseApi.drag(100, 200, 300, 400);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/drag', {
      startX: 100,
      startY: 200,
      endX: 300,
      endY: 400
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should scroll with positive clicks', async () => {
    const result = await mouseApi.scroll(100, 200, 3);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/scroll', {
      x: 100,
      y: 200,
      clicks: 3,
      direction: 'down'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should scroll with negative clicks', async () => {
    const result = await mouseApi.scroll(100, 200, -3);
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/scroll', {
      x: 100,
      y: 200,
      clicks: 3,
      direction: 'up'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should scroll with explicit direction', async () => {
    const result = await mouseApi.scroll(100, 200, 3, 'up');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/scroll', {
      x: 100,
      y: 200,
      clicks: 3,
      direction: 'up'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should click by description', async () => {
    const result = await mouseApi.clickByDescription('Submit button');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/mouse/click-by-description', {
      taskDescription: 'Submit button',
      mechanism: MechanismType.ScreenGrasp2
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should return string representation', () => {
    expect(mouseApi.toString()).toBe('MouseApi');
  });
});
