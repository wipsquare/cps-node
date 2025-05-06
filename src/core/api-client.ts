import { HttpClient } from './http-client.js';
import { ApiAuth, ApiTransaction, SupportedLanguage } from '../types/api-core.js';
import { Response } from '../types/response.js';
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
    options?: { lang?: SupportedLanguage }
  ): Promise<Response> {
    // Build the request
    const request = {
      auth: this.auth,
      transaction,
      ...(options?.lang ? { lang: options.lang } : { lang: 'en' })
    };
    
    // Convert to XML
    const xml = buildRequestXml(request);

    // Send the request using the HttpClient
    const response = await this.httpClient.sendRequest(xml);

    // Parse the response
    const parsedResponse = this.parseResponse(response.data);

    // Handle API-level errors
    if (parsedResponse.result.code !== '1000') {
      throw new CPSError(
        parsedResponse.result.message,
        parsedResponse.result.code,
        parsedResponse.result.detail as string,
        parsedResponse
      );
    }

    return parsedResponse;
  }

  /**
   * Parses an XML response from the CPS API
   * @private
   */
  private parseResponse(xml: string): Response {
    const result = xml2js(xml, { compact: true }) as ElementCompact;
    const responseObj = result.response as any;
    
    // Create the base response structure
    const response: Response = {
      result: {
        code: responseObj.result.code._text,
        detail: responseObj.result.detail._text,
        message: responseObj.result.message._text
      },
      transaction: {
        active_transactions_id: responseObj.transaction.active_transactions_id._text,
        created: responseObj.transaction.created._text,
        customer_ref: responseObj.transaction.customer_ref?._text || ''
      }
    };
    
    // Add note if present
    if (responseObj.result.note) {
      response.result.note = responseObj.result.note._text;
    }
    
    // Add auto_values if present
    if (responseObj.result.auto_values) {
      response.result.auto_values = this.parseAutoValues(responseObj.result.auto_values);
    }
    
    return response;
  }

  /**
   * Parses auto_values from the response
   * @private
   */
  private parseAutoValues(autoValues: any): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in autoValues) {
      if (Object.prototype.hasOwnProperty.call(autoValues, key)) {
        result[key] = autoValues[key]._text;
      }
    }

    return result;
  }
}
