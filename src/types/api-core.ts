/**
 * Supported languages for API requests
 */
export type SupportedLanguage = 'de' | 'en' | 'fr';

/**
 * Supported API versions
 */
export type ApiVersion = '1.8.12'

/**
 * Authentication credentials for API requests
 */
export interface ApiAuth {
  cid: string;
  user: string;
  pwd: string;
}

/**
 * Core transaction structure for API requests
 */
export interface ApiTransaction<T> {
  group: string;
  action: string;
  attribute: string;
  object?: string;
  values: T;
}

/**
 * Options for API execution
 */
export interface ApiExecuteOptions {
  lang?: SupportedLanguage;
  version?: ApiVersion;
}

/**
 * Complete API request structure
 */
export interface ApiRequest<T> extends ApiExecuteOptions {
  auth: ApiAuth;
  transaction: ApiTransaction<T>;
}

/**
 * Raw HTTP response from the API
 */
export interface HttpApiResponse {
  data: string;
  statusCode: number;
}

/**
 * api-client response
 */
export interface ApiClientResponse extends BaseReponse {
  responseObject: any
}

/**
 * Base response
 */
export interface BaseReponse {
  meta: ResponseMeta
}

interface ResponseMeta {
  transaction: ResponseTransaction
  result: ResponseResult
}

/**
 * Upstream transaction information in the API response
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
  customer_ref?: string;
}

/**
 * Upstream result information in the API response
 */
export interface ResponseResult {
  /**
   * Result code
   */
  code: string;

  /**
   * User-friendly message
   */
  message: string;

  /**
   * Detailed response data from upstream
   */
  detail: object | string

  /**
   * Optional additional note
   */
  note?: string;
}