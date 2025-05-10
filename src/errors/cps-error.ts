/**
 * Error class specific to the CPS API
 */
export class CPSError extends Error {
  /**
   * Error code from the API response or client
   */
  public readonly code: string;
  
  /**
   * Original API response or error
   */
  public readonly response: any;
  
  /**
   * Detailed error information
   */
  public readonly detail: string | object;
  
  /**
   * Original error if this CPSError wraps another error
   */
  public readonly originalError?: Error;

  constructor(message: string, code: string, detail: string | object, response: any, originalError?: Error) {
    super(message);
    this.name = 'CPSError';
    this.code = code;
    this.detail = detail;
    this.response = response;
    this.originalError = originalError;
    
    // This is necessary for proper instanceof checks in TypeScript
    Object.setPrototypeOf(this, CPSError.prototype);
  }
  
  /**
   * Returns true if this error originated from a network/HTTP issue
   */
  isNetworkError(): boolean {
    return this.code.startsWith('HTTP_') || 
           ['REQUEST_TIMEOUT', 'CONNECTION_REFUSED', 'HOST_NOT_FOUND'].includes(this.code);
  }
  
  /**
   * Returns true if this error originated from the API
   */
  isApiError(): boolean {
    return !this.isNetworkError();
  }
}
