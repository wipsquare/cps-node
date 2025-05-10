import { ApiClient } from '../core/api-client.js';
import { ApiTransaction } from '../types/api-core.js';
import {
  ContactDetails,
  CreateContactParams,
  CreateContactResponse,
  InfoContactResponse,
  ListContactsParams,
  ListContactsResponse,
  DeleteContactResponse,
  ListContactItem,
  CheckContactResponse
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

  /**
 * Gets detailed information about a specific contact
 * @param contact_id - ID of the contact to retrieve
 * @returns Promise resolving to the contact details
 */
  info(contact_id: string): Promise<InfoContactResponse>;

  /**
   * Deletes a contact by ID
   * @param contact_id - ID of the contact to delete
   * @returns Promise resolving to the delete operation response
   */
  delete(contact_id: string): Promise<DeleteContactResponse>;

  /**
   * Checks if a contact ID is available for registration
   * @param contact_id - The contact ID to check
   * @returns Promise resolving to the check operation response
   */
  check(contact_id: string): Promise<CheckContactResponse>;
}

/**
 * Creates the contacts resource
 * @internal
 */
export function createContactsResource(apiClient: ApiClient): ContactsResource {
  return {
    async create(params: CreateContactParams): Promise<CreateContactResponse> {
      const { contact_id, ...values } = params;

      const transaction: ApiTransaction<typeof values> = {
        group: 'contact',
        action: 'create',
        attribute: 'contact',
        object: contact_id || '%%AUTO%%',
        values
      };

      // Get generic response from API client
      const apiResponse = await apiClient.execute(transaction);

      const response: CreateContactResponse = {
        data: {
          contact_id: ''
        },
        meta: apiResponse.meta
      }

      if (contact_id) {
        response.data.contact_id = contact_id
      } else {
        response.data.contact_id = apiResponse.responseObject.result.auto_values.contact_id._text
      }

      return response
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
      const apiResponse = await apiClient.execute(transaction);

      // Parse the contact list from the response
      const contactList = parseContactListFromResponse(apiResponse.responseObject.result.detail);

      const response: ListContactsResponse = {
        data: contactList,
        meta: apiResponse.meta
      }

      return response
    },

    async info(contact_id: string): Promise<InfoContactResponse> {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'contact',
        action: 'info',
        attribute: 'contact',
        object: contact_id,
        values: {}
      };

      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);

      const contactDetails: ContactDetails = {
        contact_id: apiResponse.responseObject.result.detail.values.contact_id?._text || '',
        firstname: apiResponse.responseObject.result.detail.values.firstname?._text || '',
        lastname: apiResponse.responseObject.result.detail.values.lastname?._text || '',
        orgname: apiResponse.responseObject.result.detail.values.orgname?._text,
        street: apiResponse.responseObject.result.detail.values.street?._text || '',
        postal: apiResponse.responseObject.result.detail.values.postal?._text || '',
        city: apiResponse.responseObject.result.detail.values.city?._text || '',
        state: apiResponse.responseObject.result.detail.values.state?._text || '',
        iso_country: apiResponse.responseObject.result.detail.values.iso_country?._text || '',
        phone: apiResponse.responseObject.result.detail.values.phone?._text || '',
        fax: apiResponse.responseObject.result.detail.values.fax?._text,
        email: apiResponse.responseObject.result.detail.values.email?._text || '',
        contact_type: (apiResponse.responseObject.result.detail.values.contact_type?._text || 'person') as 'person' | 'organisation',
        disclosure: apiResponse.responseObject.result.detail.values.disclosure?._text as 'active' | 'disabled',
        created: apiResponse.responseObject.result.detail.values.created?._text || '',
        created_by: apiResponse.responseObject.result.detail.values.created_by?._text || '',
        modified: apiResponse.responseObject.result.detail.values.modified?._text || '',
        modified_by: apiResponse.responseObject.result.detail.values.modified_by?._text || '',
        user: apiResponse.responseObject.result.detail.values.user?._text || ''
      };

      const response: InfoContactResponse = {
        data: contactDetails,
        meta: apiResponse.meta
      }

      return response;
    },

    async delete(contact_id: string): Promise<DeleteContactResponse> {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'contact',
        action: 'delete',
        attribute: 'contact',
        object: contact_id,
        values: {}
      };

      // Get generic response from API client
      const apiResponse = await apiClient.execute(transaction);

      const response: DeleteContactResponse = {
        data: {
          contact_id: contact_id
        },
        meta: apiResponse.meta
      }

      // Cast to specific response type for this endpoint
      return response as DeleteContactResponse;
    },
    async check(contact_id: string): Promise<CheckContactResponse> {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'contact',
        action: 'info',
        attribute: 'check',
        object: contact_id,
        values: {}
      };
    
      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);
    
      // Parse the response values
      const values = apiResponse.responseObject.result.detail.values;
      
      // Simplified response with just contact_id and available
      const response: CheckContactResponse = {
        data: {
          contact_id: contact_id,
          available: values.avail?._text === 'true'
        },
        meta: apiResponse.meta
      };
    
      return response;
    }
  };
}

/**
 * Parse contact list from the API response detail
 * @private
 */
function parseContactListFromResponse(detail: any): ListContactItem[] {
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
function parseContactValues(values: any): ListContactItem {
  const result: Partial<ListContactItem> = {};

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key) && values[key]._text !== undefined) {
      // Extract the text value from each property
      result[key as keyof ListContactItem] = values[key]._text;
    }
  }

  return result as ListContactItem;
}
