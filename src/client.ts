import { CPSOptions } from './types/client.js';
import { HttpClient } from './core/http-client.js';
import { ApiClient } from './core/api-client.js';
import { ContactsResource, createContactsResource } from './resources/contacts.js';
import { DomainsResource, createDomainsResource } from './resources/domains.js';
// Import other resources as needed

/**
 * Client for interacting with the CPS domain management API
 */
export class CPSClient {
  private readonly httpClient: HttpClient;
  private readonly apiClient: ApiClient;
  
  /**
   * Contact operations
   */
  readonly contacts: ContactsResource;
  
  // Add other resources as properties
  readonly domains: DomainsResource;
  
  /**
   * Creates a new CPS API client
   * @param options - Configuration options for the client
   */
  constructor(options: CPSOptions) {
    const fullOptions: Required<CPSOptions> = {
      cid: options.cid,
      user: options.user,
      password: options.password,
      apiUrl: options.apiUrl,
      timeout: options.timeout || 30000
    };
    
    // Create the HTTP client with only HTTP-related options
    this.httpClient = new HttpClient(fullOptions.apiUrl, fullOptions.timeout);
    
    // Create the API client with API-specific options including auth
    this.apiClient = new ApiClient({
      auth: {
        cid: fullOptions.cid,
        user: fullOptions.user,
        pwd: fullOptions.password
      },
      httpClient: this.httpClient
    });
    
    // Initialize resources with the API client
    this.contacts = createContactsResource(this.apiClient);
    this.domains = createDomainsResource(this.apiClient);
    // Initialize other resources...
  }
  
  /**
   * Returns the API URL configured for this client
   * @returns The base API URL
   */
  getApiUrl(): string {
    return this.httpClient.getApiUrl();
  }
}
