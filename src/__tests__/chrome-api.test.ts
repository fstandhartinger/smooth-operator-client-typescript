import { ChromeApi } from '../src/api/chrome-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';

describe('ChromeApi', () => {
  let chromeApi: ChromeApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    } as unknown as SmoothOperatorClient;
    
    chromeApi = new ChromeApi(mockClient);
  });
  
  test('should open Chrome', async () => {
    const result = await chromeApi.openChrome('https://example.com', 'default');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/system/open-chrome', {
      url: 'https://example.com',
      strategy: 'default'
    });
    expect(result).toEqual({ success: true });
  });
  
  test('should explain current tab', async () => {
    await chromeApi.explainCurrentTab();
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/current-tab/explain', {});
  });
  
  test('should navigate to URL', async () => {
    await chromeApi.navigate('https://example.com');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/navigate', {
      url: 'https://example.com'
    });
  });
  
  test('should reload page', async () => {
    await chromeApi.reload();
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/reload', {});
  });
  
  test('should open new tab', async () => {
    await chromeApi.newTab('https://example.com');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/new-tab', {
      url: 'https://example.com'
    });
  });
  
  test('should click element', async () => {
    await chromeApi.clickElement('#submit-button');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/click-element', {
      selector: '#submit-button'
    });
  });
  
  test('should go back', async () => {
    await chromeApi.goBack();
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/go-back', {});
  });
  
  test('should simulate input', async () => {
    await chromeApi.simulateInput('#username', 'testuser');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/simulate-input', {
      selector: '#username',
      text: 'testuser'
    });
  });
  
  test('should get DOM', async () => {
    await chromeApi.getDom();
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/get-dom', {});
  });
  
  test('should get text', async () => {
    await chromeApi.getText();
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/get-text', {});
  });
  
  test('should execute script', async () => {
    await chromeApi.executeScript('return document.title;');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/execute-script', {
      script: 'return document.title;'
    });
  });
  
  test('should generate and execute script', async () => {
    await chromeApi.generateAndExecuteScript('Get all links on the page');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/chrome/generate-and-execute-script', {
      taskDescription: 'Get all links on the page'
    });
  });
  
  test('should return string representation', () => {
    expect(chromeApi.toString()).toBe('ChromeApi');
  });
});
