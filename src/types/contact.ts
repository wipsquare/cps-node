import { BaseReponse } from './api-core.js';

export interface Contact {
  firstname: string;
  lastname: string;
  orgname?: string;
  street: string;
  postal: string;
  city: string;
  state: string;
  iso_country: string;
  phone: string;
  fax?: string;
  email: string;
  contact_type: 'person' | 'organisation';
  disclosure?: 'active' | 'disabled';
}

export interface ContactBase {
  firstname: string;
  lastname: string;
  orgname?: string;
  city: string;
  email: string;
  contact_type: 'person' | 'organisation';
  disclosure: 'active' | 'disabled';
}

export interface ContactExtended extends ContactBase {
  street: string;
  postal: string;
  state: string;
  iso_country: string;
  phone: string;
  fax?: string;
}

export interface CreateContactParams extends ContactExtended {
  contact_id?: string
}

export interface CreateContactResponse extends BaseReponse {
  data: {
    contact_id: string
  }
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
export interface ListContactItem {
  contact_id: string;
  user: string;
  firstname: string;
  lastname: string;
  orgname: string;
  city: string;
  email: string;
  contact_type: 'person' | 'organisation';
  disclosure: 'active' | 'disabled';
  created: string;
  modified: string;
}

/**
 * Response from listing contacts
 */
export interface ListContactsResponse extends BaseReponse {
  data: ListContactItem[]
}

export interface DeleteContactResponse extends BaseReponse {
  data: {
    contact_id: string
  }
}

/**
 * Extended contact information returned by the info operation
 */
export interface ContactDetails extends ContactExtended {
  contact_id: string;
  created: string;
  created_by: string;
  modified: string;
  modified_by: string;
  user: string;
}

/**
 * Response from getting contact details
 */
export interface InfoContactResponse extends BaseReponse {
  data: ContactDetails
}

/**
 * Response from checking contact availability
 */
export interface CheckContactResponse extends BaseReponse {
  data: {
    /**
     * The contact ID that was checked
     */
    contact_id: string;
    
    /**
     * Whether the contact ID is available (true = available, false = already exists)
     */
    available: boolean;
  }
}