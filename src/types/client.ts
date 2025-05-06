/**
 * Configuration options for the CPS API client
 */
export interface CPSOptions {
  /**
   * Customer ID issued by CPS
   */
  cid: string;
  
  /**
   * User for API connection
   */
  user: string;
  /**
   * Password corresponding to the user for API connection
   */
  password: string;

  /**
   * Base URL for the CPS API endpoints
   */
  apiUrl: string;
  
  /**
   * Timeout for API requests in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;
}
