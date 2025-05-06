/**
 * Supported languages for API requests
 */
export type SupportedLanguage = 'de' | 'en' | 'fr';

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
}

/**
 * Complete API request structure
 */
export interface ApiRequest<T> {
  lang?: SupportedLanguage;
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
