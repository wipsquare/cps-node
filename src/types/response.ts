/**
 * Response from the CPS API
 * Represents the raw HTTP response before XML parsing
 */
export interface HttpApiResponse {
  /**
   * Raw XML response from the API
   */
  data: string;
  
  /**
   * HTTP status code
   */
  statusCode: number;
}

/**
 * Transaction information in the API response
 */
export interface ResponseTransaction {
  /**
   * Transaction identifier
   */
  active_transactions_id: string;
  
  /**
   * Creation timestamp
   */
  created: string;
  
  /**
   * Customer reference ID (if provided in request)
   */
  customer_ref: string;
}

/**
 * Result information in the API response
 */
export interface ResponseResult<T = unknown, A = Record<string, string>> {
  /**
   * Result code
   */
  code: string;
  
  /**
   * Detailed information or response data
   */
  detail: string | T;
  
  /**
   * User-friendly message
   */
  message: string;
  
  /**
   * Auto-generated values (if any)
   */
  auto_values?: A;
  
  /**
   * Optional additional note
   */
  note?: string;
}

/**
 * Generic response structure from the ORMS API
 */
export interface Response<T = unknown, A = Record<string, string>> {
  /**
   * Transaction information
   */
  transaction: ResponseTransaction;
  
  /**
   * Result information
   */
  result: ResponseResult<T, A>;
}
