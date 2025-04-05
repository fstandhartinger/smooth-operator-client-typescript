import { CodeApi } from '../src/api/code-api';
import { SmoothOperatorClient } from '../src/smooth-operator-client';

describe('CodeApi', () => {
  let codeApi: CodeApi;
  let mockClient: SmoothOperatorClient;
  
  beforeEach(() => {
    mockClient = {
      post: jest.fn().mockResolvedValue({ success: true, result: 'test result' })
    } as unknown as SmoothOperatorClient;
    
    codeApi = new CodeApi(mockClient);
  });
  
  test('should execute C# code', async () => {
    const result = await codeApi.executeCSharp('Console.WriteLine("Hello");');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/code/csharp', {
      code: 'Console.WriteLine("Hello");'
    });
    expect(result).toEqual({ success: true, result: 'test result' });
  });
  
  test('should generate and execute C# code', async () => {
    const result = await codeApi.generateAndExecuteCSharp('Create a function that calculates factorial');
    
    expect(mockClient.post).toHaveBeenCalledWith('/tools-api/code/csharp/generate-and-execute', {
      taskDescription: 'Create a function that calculates factorial'
    });
    expect(result).toEqual({ success: true, result: 'test result' });
  });
  
  test('should return string representation', () => {
    expect(codeApi.toString()).toBe('CodeApi');
  });
});
