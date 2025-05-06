import { Response } from './response.js';

export interface CreateContactParams extends Contact {
  /**
   * An ID to be allocated to the contact. If not specified, one will be auto generated
   */
  objectId?: string;
}

export interface Contact {

  /**
   * First name of the customer or organisation representative
   */
  firstname: string;

  /**
   * Last name of the customer or organisation representative
   */
  lastname: string;

  /**
   * Organization name. Manadatory if contact_type='organization'
   */
  orgname?: string;

  /**
   * Street address
   */
  street: string;

  /**
   * Postal/ZIP code
   */
  postal: string;

  /**
   * City
   */
  city: string;

  /**
   * State/province
   */
  state: string;

  /**
   * Country code (ISO)
   */
  iso_country: string;

  /**
   * Phone number (international format)
   */
  phone: string;

  /**
   * Fax number (optional)
   */
  fax?: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Customer type
   */
  contact_type: 'person' | 'organisation';

  /**
   * Disclosure preference
   */
  disclosure?: 'active' | 'disabled';
}


/**
 * Auto-generated values for contact creation
 */
interface ContactAutoValues {
  /**
   * Generated contact ID
   */
  contact_id?: string;
}

/**
 * Response from contact creation
 * 
 * When %%AUTO%% is used, auto_values will be present with a generated contact_id
 * When a specific objectId is provided, auto_values will be absent
 */
export interface CreateContactResponse extends Response<string, ContactAutoValues> {
  // The Response interface already provides the correct structure
}

/**
 * Parameters for listing contacts
 */
export interface ListContactsParams {
  /**
   * Filter by user
   * @default '*' (all users)
   */
  user?: string;
  
  /**
   * Filter by first name
   * @default '*' (all first names)
   */
  firstname?: string;
  
  /**
   * Filter by last name
   * @default '*' (all last names) 
   */
  lastname?: string;
  
  /**
   * Organization name
   * @default '*' (all organization names)
   */
  orgname?: string;
  
  /**
   * Filter by city
   * @default '*' (all cities)
   */
  city?: string;
  
  /**
   * Filter by email
   * @default '*' (all emails)
   */
  email?: string;
  
  /**
   * Filter by contact type
   * @default '*' (all contact types)
   */
  contact_type?: 'person' | 'organisation' | '*';
  
  /**
   * Include or exclude workgroup contacts
   * @default 'exclude'
   */
  workgroup?: 'include' | 'exclude';
  
  /**
   * Filter by disclosure setting
   * @default '*' (all disclosure settings)
   */
  disclosure?: 'active' | 'disabled' | '*';
}

/**
 * Contact information returned in list operation
 */
export interface ContactListItem {
  /**
   * Unique identifier of the contact
   */
  contact_id: string;
  
  /**
   * User who owns the contact
   */
  user: string;
  
  /**
   * First name of the contact
   */
  firstname: string;
  
  /**
   * Last name of the contact
   */
  lastname: string;
  
  /**
   * Organization name (if applicable)
   */
  orgname: string;
  
  /**
   * City of the contact
   */
  city: string;
  
  /**
   * Email address of the contact
   */
  email: string;
  
  /**
   * Type of contact
   */
  contact_type: 'person' | 'organisation';
  
  /**
   * Disclosure preference
   */
  disclosure: 'active' | 'disabled';
  
  /**
   * Date when the contact was created
   */
  created: string;
  
  /**
   * Date when the contact was last modified
   */
  modified: string;
}

/**
 * Response from listing contacts
 */
export interface ListContactsResponse extends Response<ContactListItem[]> {
  // The Response interface already provides the correct structure
}