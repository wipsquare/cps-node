/**
 * Error class specific to the CPS API
 */
export class CPSError extends Error {
  /**
   * Error code from the API response
   */
  public readonly code: string;
  
  /**
   * Original API response
   */
  public readonly response: any;
  
  /**
   * Detailed error information
   */
  public readonly detail: string;

  constructor(message: string, code: string, detail: string, response: any) {
    super(message);
    this.name = 'CPSError';
    this.code = code;
    this.detail = detail;
    this.response = response;
    
    // This is necessary for proper instanceof checks in TypeScript
    Object.setPrototypeOf(this, CPSError.prototype);
  }
}
