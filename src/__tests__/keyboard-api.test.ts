import { KeyboardApi } from '../src/api/keyboard-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';

describe('KeyboardApi', () => {
  let keyboardApi: KeyboardApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    } as unknown as SmoothOperatorClient;
    
    keyboardApi = new KeyboardApi(mockClient);
  });
  
  test('should type text', async () => {
    const result = await keyboardApi.type('Hello, world!');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/keyboard/type', {
      text: 'Hello, world!'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should press key', async () => {
    const result = await keyboardApi.press('Ctrl+C');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/keyboard/press', {
      key: 'Ctrl+C'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should type at element', async () => {
    const result = await keyboardApi.typeAtElement('Username field', 'testuser');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/keyboard/type-at-element', {
      elementDescription: 'Username field',
      textToType: 'testuser'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should return string representation', () => {
    expect(keyboardApi.toString()).toBe('KeyboardApi');
  });
});
