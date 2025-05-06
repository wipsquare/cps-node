// Export the main client
export { CPSClient } from './client.js';

// Export your custom error
export { CPSError } from './errors/index.js';

// Re-export the AxiosError type for users
export type { AxiosError } from 'axios';

// Export types
export type { CPSOptions } from './types/client.js';
export type { 
  Contact, 
  CreateContactParams, 
  CreateContactResponse,
  ListContactsParams,
  ListContactsResponse,
  ContactListItem
} from './types/contact.js';
// Export other types as needed