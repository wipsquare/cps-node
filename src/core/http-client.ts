import axios, { AxiosRequestConfig } from 'axios';
import { HttpApiResponse } from '../types/api-core.js';

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
   * May throw AxiosError for HTTP/network issues
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

    // Let Axios errors propagate directly to the caller
    const response = await axios(config);
    return {
      data: response.data,
      statusCode: response.status
    };
  }
  
  /**
   * Returns the configured API endpoint
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
