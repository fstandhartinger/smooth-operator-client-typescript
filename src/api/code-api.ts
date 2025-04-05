import { CSharpCodeResponse } from '../models/models';
import { SmoothOperatorClient } from '../smooth-operator-client';

/**
 * API endpoints for code execution operations
 */
export class CodeApi {
  private client: SmoothOperatorClient;

  /**
   * Creates a new instance of the CodeApi
   * @param client The SmoothOperatorClient instance
   */
  constructor(client: SmoothOperatorClient) {
    this.client = client;
  }

  /**
   * Executes C# code on server and returns output
   * @param code C# code to run
   * @returns CSharpCodeResponse with execution result
   */
  public async executeCSharp(code: string): Promise<CSharpCodeResponse> {
    return this.client.post<CSharpCodeResponse>('/tools-api/code/csharp', { code });
  }

  /**
   * Generate and execute C# code based on a description
   * @param taskDescription Description of what the C# code should do, include error feedback if a previous try wasn't successful
   * @returns CSharpCodeResponse with execution result
   */
  public async generateAndExecuteCSharp(taskDescription: string): Promise<CSharpCodeResponse> {
    return this.client.post<CSharpCodeResponse>('/tools-api/code/csharp/generate-and-execute', { taskDescription });
  }

  /**
   * Returns a string representation of the CodeApi class.
   * @returns The string "CodeApi".
   */
  public toString(): string {
    return 'CodeApi';
  }
}
