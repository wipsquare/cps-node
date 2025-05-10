import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpApiResponse } from '../types/api-core.js';
import { CPSError } from '../errors/index.js';

/**
 * Internal HTTP client that handles communication with the CPS API
 * Focuses purely on HTTP-level concerns
 * @internal
 */
export class HttpClient {
  private readonly apiUrl: string;
  private readonly timeout: number;
  
  constructor(apiUrl: string, timeout: number = 30000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }
  
  /**
   * Sends a request to the API
   * Converts all Axios errors to CPSError
   */
  async sendRequest(data: string): Promise<HttpApiResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: this.apiUrl,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: this.timeout,
      responseType: 'text',
      httpsAgent: new (await import('https')).Agent({
        rejectUnauthorized: false
      })
    };

    try {
      // Attempt to send the request
      const response = await axios(config);
      return {
        data: response.data,
        statusCode: response.status
      };
    } catch (error) {
      // Convert all Axios errors to CPSError
      if (axios.isAxiosError(error)) {
        throw this.convertAxiosError(error);
      }
      
      // For any other unexpected errors
      throw new CPSError(
        `Unexpected error: ${(error as Error).message || 'Unknown error'}`,
        'UNKNOWN_ERROR',
        { originalError: error },
        null
      );
    }
  }
  
  /**
   * Converts an Axios error to a CPSError
   * @private
   */
  private convertAxiosError(error: AxiosError): CPSError {
    // Determine appropriate error code and message based on the Axios error
    let code = 'HTTP_ERROR';
    let message = 'HTTP request failed';
    let detail: any = { url: this.apiUrl };
    
    if (error.code === 'ECONNABORTED') {
      code = 'REQUEST_TIMEOUT';
      message = `Request timed out after ${this.timeout}ms`;
    } else if (error.code === 'ECONNREFUSED') {
      code = 'CONNECTION_REFUSED';
      message = 'Connection refused by the server';
    } else if (error.code === 'ENOTFOUND') {
      code = 'HOST_NOT_FOUND';
      message = 'Host not found';
    } else if (error.response) {
      // We have a response with an error status
      code = `HTTP_${error.response.status}`;
      message = `HTTP error ${error.response.status}: ${error.response.statusText}`;
      detail.status = error.response.status;
      detail.statusText = error.response.statusText;
      
      // Include response data if available
      if (error.response.data) {
        detail.responseData = error.response.data;
      }
    }
    
    return new CPSError(
      message,
      code,
      detail,
      error  // Store the original error
    );
  }
  
  /**
   * Returns the configured API endpoint
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
