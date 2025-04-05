import { AutomationApi } from '../src/api/automation-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';

describe('AutomationApi', () => {
  let automationApi: AutomationApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    } as unknown as SmoothOperatorClient;
    
    automationApi = new AutomationApi(mockClient);
  });
  
  test('should open application', async () => {
    const result = await automationApi.openApplication('notepad.exe');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/system/open-application', {
      appNameOrPath: 'notepad.exe'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should invoke element', async () => {
    const result = await automationApi.invoke('element-123');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/invoke', {
      elementId: 'element-123'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should set value', async () => {
    const result = await automationApi.setValue('element-123', 'test value');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/set-value', {
      elementId: 'element-123',
      value: 'test value'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should set focus', async () => {
    const result = await automationApi.setFocus('element-123');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/set-focus', {
      elementId: 'element-123'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should get window details', async () => {
    await automationApi.getWindowDetails('window-123');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/get-details', {
      windowId: 'window-123'
    });
  });
  
  test('should bring window to front', async () => {
    await automationApi.bringToFront('window-123');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/bring-to-front', {
      windowId: 'window-123'
    });
  });
  
  test('should click element by description', async () => {
    await automationApi.clickElement('Submit button');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/click-element', {
      description: 'Submit button'
    });
  });
  
  test('should type in element by description', async () => {
    await automationApi.typeInElement('Username field', 'testuser');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/type-in-element', {
      description: 'Username field',
      text: 'testuser'
    });
  });
  
  test('should get element text by description', async () => {
    await automationApi.getElementText('Status message');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/automation/get-element-text', {
      description: 'Status message'
    });
  });
  
  test('should return string representation', () => {
    expect(automationApi.toString()).toBe('AutomationApi');
  });
});
