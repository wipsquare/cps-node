import { HttpClient } from './http-client.js';
import { ApiAuth, ApiTransaction, ApiVersion, SupportedLanguage, ApiClientResponse } from '../types/api-core.js';
import { CPSError } from '../errors/index.js';
import { xml2js, ElementCompact } from 'xml-js';
import { buildRequestXml } from './xml-builder.js';

interface ApiClientOptions {
  httpClient: HttpClient;
  auth: ApiAuth;
}

/**
 * API client that handles CPS API-specific concerns
 * @internal
 */
export class ApiClient {
  private readonly httpClient: HttpClient;
  private readonly auth: ApiAuth;

  constructor(options: ApiClientOptions) {
    this.httpClient = options.httpClient;
    this.auth = options.auth;
  }

  /**
   * Executes a transaction and returns the parsed response
   * Handles API-level errors
   */
  async execute(
    transaction: ApiTransaction<any>,
    options?: { lang?: SupportedLanguage, version?: ApiVersion }
  ): Promise<ApiClientResponse> {
    // Build the request
    const request = {
      auth: this.auth,
      transaction,
      ...(options?.lang ? { lang: options.lang } : { lang: 'en' }),
      ...(options?.version ? { version: options.version } : { version: '1.8.12' }),
    };
    
    // Convert to XML
    const xml = buildRequestXml(request);

    // Send the request using the HttpClient
    const response = await this.httpClient.sendRequest(xml);
    // console.log({rawResponse: response.data})
    // Parse the response
    const parsedResponse = this.parseResponse(response.data);

    // Handle API-level errors
    if (parsedResponse.meta.result.code !== '1000') {
      throw new CPSError(
        parsedResponse.meta.result.message,
        parsedResponse.meta.result.code,
        parsedResponse.meta.result.detail,
        parsedResponse,
        undefined // No original error
      );
    }

    return parsedResponse;
  }

  /**
   * Parses an XML response from the CPS API
   * @private
   */
  private parseResponse(xml: string): ApiClientResponse {
    const result = xml2js(xml, { compact: true }) as ElementCompact;
    const responseObj = result.response as any;
    //console.log(responseObj.result.detail)
    
    // Create the base response structure
    const response: ApiClientResponse = {
      responseObject: responseObj,
      meta: {
        result: {
          code: responseObj.result.code._text,
          message: responseObj.result.message._text,
          detail: responseObj.result.detail
        },
        transaction: {
          active_transactions_id: responseObj.transaction.active_transactions_id._text,
          created: responseObj.transaction.created._text,
          customer_ref: responseObj.transaction.customer_ref?._text || ''
        }
      }
      
      
    };
    
    // Add note if present
    if (responseObj.result.note) {
      response.meta.result.note = responseObj.result.note._text;
    }
    
    // Add customer_ref if present
    if (responseObj.transaction.customer_ref) {
      response.meta.transaction.customer_ref = responseObj.transaction.customer_ref._text
    }

    //console.log({response})
    
    return response;
  }
}
