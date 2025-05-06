import { ApiClient } from '../core/api-client.js';
import { ApiTransaction } from '../types/api-core.js';
import { 
  Contact,
  ContactListItem,
  CreateContactParams, 
  CreateContactResponse,
  ListContactsParams,
  ListContactsResponse 
} from '../types/contact.js';

/**
 * Interface for contact-related operations
 */
export interface ContactsResource {
  /**
   * Creates a new contact
   * @param params - Contact creation parameters
   * @returns Promise resolving to the created contact response
   */
  create(params: CreateContactParams): Promise<CreateContactResponse>;

  /**
   * Lists contacts with optional filtering
   * @param params - Parameters to filter the contact list
   * @returns Promise resolving to the list of contacts
   */
  list(params?: ListContactsParams): Promise<ListContactsResponse>;
}

/**
 * Creates the contacts resource
 * @internal
 */
export function createContactsResource(apiClient: ApiClient): ContactsResource {
  return {
    async create(params: CreateContactParams): Promise<CreateContactResponse> {
      const { objectId, ...values } = params;
      
      const transaction: ApiTransaction<typeof values> = {
        group: 'contact',
        action: 'create',
        attribute: 'contact',
        object: objectId || '%%AUTO%%',
        values
      };
      
      // Get generic response from API client
      const response = await apiClient.execute(transaction);
      
      // Cast to specific response type for this endpoint
      return response as CreateContactResponse;
    },
    async list(params: ListContactsParams = {}): Promise<ListContactsResponse> {
      // Set default values for all optional parameters
      const values: Record<string, string> = {
        user: params.user || '*',
        firstname: params.firstname || '*',
        lastname: params.lastname || '*',
        orgname: params.orgname || '*',
        city: params.city || '*',
        email: params.email || '*',
        contact_type: params.contact_type || '*',
        workgroup: params.workgroup || 'exclude',
        disclosure: params.disclosure || '*'
      };
      
      const transaction: ApiTransaction<typeof values> = {
        group: 'contact',
        action: 'list',
        attribute: 'contact',
        values
      };
      
      // Get response from API client
      const response = await apiClient.execute(transaction);
      
      // Parse the contact list from the response
      const contactList = parseContactListFromResponse(response.result.detail);
      
      // Return properly typed response with the parsed contacts list
      return {
        ...response,
        result: {
          ...response.result,
          detail: contactList
        }
      } as ListContactsResponse;
    }
  };
}

/**
 * Parse contact list from the API response detail
 * @private
 */
function parseContactListFromResponse(detail: any): ContactListItem[] {
  if (!detail || !detail.values) {
    return [];
  }
  
  // If there's a single values object
  if (!Array.isArray(detail.values)) {
    return [parseContactValues(detail.values)];
  }
  
  // If there's an array of values objects
  return detail.values.map((item: any) => parseContactValues(item));
}

/**
 * Parse a single contact values object from the API response
 * @private
 */
function parseContactValues(values: any): ContactListItem {
  const result: Partial<ContactListItem> = {};
  
  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key) && values[key]._text !== undefined) {
      // Extract the text value from each property
      result[key as keyof ContactListItem] = values[key]._text;
    }
  }
  
  return result as ContactListItem;
}
