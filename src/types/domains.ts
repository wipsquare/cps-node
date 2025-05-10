import { BaseReponse } from './api-core.js';

export interface TldAccessRights {
  application: boolean;
  auto_renew: boolean;
  chstatus: boolean;
  create: boolean;
  delegation: boolean;
  delete: boolean;
  dnssec: boolean;
  host: boolean;
  modify: boolean;
  owner_change: boolean;
  release: boolean;
  restore: boolean;
  transfer: boolean;
  transfer_lock: boolean;
  whois_proxy: boolean;
}

export interface TldConfig {
  dns_check: boolean;
  period_yrs: number;
  slds: string;
  transfer_auto_sync: boolean;
}

export interface FaqTopic {
  title: string;
  text: string;
}

export interface TldPolicy {
  email_validation: boolean;
  expire_notification: boolean;
  owchg_notification: boolean;
  registration_data_directory_notification: boolean;
  transfer_authorization_notification: boolean;
}

export interface TldSpecifications {
  legal: string;
  tech: string;
}

export interface WorkflowItem {
  description: string;
  processing_time: number;
  pt_unit: string;
}

export interface TldWorkflow {
  auto_renew: WorkflowItem;
  chstatus: WorkflowItem;
  create: WorkflowItem;
  delegation: WorkflowItem;
  delete: WorkflowItem;
  dnssec: WorkflowItem;
  host: WorkflowItem;
  modify: WorkflowItem;
  owner_change: WorkflowItem;
  release: WorkflowItem;
  restore: WorkflowItem;
  transfer: WorkflowItem;
  transfer_lock: WorkflowItem;
  whois_proxy: WorkflowItem;
}

export interface TldInfo {
  access_rights: TldAccessRights;
  classification: string;
  config: TldConfig;
  // Make faq optional since some TLDs don't have FAQs
  faq?: { topic: FaqTopic | FaqTopic[] };
  launch_date: string;
  modified: string;
  policy: TldPolicy;
  policy_url: string;
  rdap_url: string;
  registry_name: string;
  remarks: string;
  specifications: TldSpecifications;
  tld: string;
  usage: string;
  website_url: string;
  whois_hostname: string;
  workflow: TldWorkflow;
}

export interface InfoTldResponse extends BaseReponse {
  data: TldInfo;
}

/**
 * DNS nameservers configuration for domain creation
 */
export interface Nameserver {
  /**
   * Hostname of the nameserver (e.g., ns1.example.com)
   */
  hostname?: string;
  
  /**
   * IP address of the nameserver (only required for glue records)
   */
  hostip?: string;
}

/**
 * Parameters for domain creation
 */
/**
 * Parameters for domain creation
 */
export interface CreateDomainParams {
  /**
   * Domain name to register (e.g., example.com)
   */
  domain: string;
  
  /**
   * Owner contact ID
   */
  ownerc: string;
  
  /**
   * Admin contact ID
   */
  adminc: string;
  
  /**
   * Technical contact ID
   */
  techc: string;
  
  /**
   * Billing contact ID
   */
  billc: string;
  
  /**
   * Nameservers configuration
   * Most TLDs require at least 2 nameservers
   */
  nameservers: Nameserver[];
  
  /**
   * Optional client reference ID for tracking
   */
  customer_ref?: string;
}

/**
 * Response from domain creation
 */
export interface CreateDomainResponse extends BaseReponse {
  data: {
    domain: string;
  };
}


/**
 * Response from getting domain details
 */
export interface InfoDomainResponse extends BaseReponse {
  data: DomainInfo;
}

/**
 * Detailed domain information returned by the info operation
 */
export interface DomainInfo {
  adminc: string;
  auth_info: string;
  authinfo: AuthInfo;
  billc: string;
  child_host: string;
  chreseller_auth: string;
  created: string;
  created_by: string;
  dataquality: string;
  nameservers: Nameserver[];
  dnssec: string;
  domain: string;
  expire: string;
  external_roid: string;
  keydate: string;
  life_cycle: LifeCycle[];
  modified: string;
  modified_by: string;
  native_domain: string;
  options: DomainOptions;
  ownerc: string;
  registry_sync: boolean;
  restricted: string;
  status: string;
  task: string;
  techc: string;
  tld: string;
  transaction_lock: TransactionLock;
  user: string;
}

/**
 * Auth info for a domain
 */
export interface AuthInfo {
  pw: string;
  validity: string;
}

/**
 * Domain lifecycle period information
 */
export interface LifeCycle {
  keydate: string;
  period: string;
}

/**
 * Transaction lock information
 */
export interface TransactionLock {
  reason: string;
  status: string;
}

/**
 * Domain options configuration
 */
export interface DomainOptions {
  auto_renew: 'active' | 'disabled';
  delegation: 'active' | 'disabled';
  transfer_lock: 'active' | 'disabled';
  whois_proxy: 'active' | 'disabled';
}


/**
 * Parameters for listing domains in the portfolio
 */
export interface ListDomainsParams {
  /**
   * Filter by domain name
   * @default '*' (all domains)
   */
  domain?: string;
  
  /**
   * Filter by native domain name
   * @default '*' (all native domains)
   */
  native_domain?: string;
  
  /**
   * Filter by user
   * @default '*' (all users)
   */
  user?: string;
  
  /**
   * Filter by contact ID
   * @default '*' (all contact IDs)
   */
  contact_id?: string;
  
  /**
   * Filter by domain status
   * @default '*' (all statuses)
   */
  status?: string;
  
  /**
   * Filter by registry sync status
   * @default '*' (all sync statuses)
   */
  registry_sync?: '*' | 'true' | 'false';
  
  /**
   * Filter by nameservers
   * Each entry filters domains using the specific nameserver
   * @default null (no nameserver filtering)
   */
  nameservers?: Array<{hostname: string}>;
  
  /**
   * Filter by auto-renew setting
   * @default '*' (all settings)
   */
  auto_renew?: '*' | 'active' | 'disabled';
  
  /**
   * Filter by transfer lock setting
   * @default '*' (all settings)
   */
  transfer_lock?: '*' | 'active' | 'disabled';
  
  /**
   * Filter by delegation setting
   * @default '*' (all settings)
   */
  delegation?: '*' | 'active' | 'disabled';
  
  /**
   * Filter by WHOIS proxy setting
   * @default '*' (all settings)
   */
  whois_proxy?: '*' | 'active' | 'disabled';
  
  /**
   * Filter by expiration date range - start date
   * @default '' (no start date filtering)
   */
  expire_begin?: string;
  
  /**
   * Filter by expiration date range - end date
   * @default '' (no end date filtering)
   */
  expire_end?: string;
  
  /**
   * Filter by data quality
   * @default '*' (all quality statuses)
   */
  dataquality?: string;
}

/**
 * Domain list item - a subset of domain info returned when listing domains
 */
export interface DomainListItem {
  domain: string;
  native_domain: string;
  status: string;
  registry_sync: boolean;
  dataquality: string;
  created: string;
  modified: string;
  expire: string;
  keydate: string;
  ownerc: string;
  adminc: string;
  techc: string;
  billc: string;
  nameservers: Nameserver[];
  options: DomainOptions;
  user: string;
  transaction_lock: {
    status: string;
  };
}

/**
 * Response from listing domains
 */
export interface ListDomainsResponse extends BaseReponse {
  data: DomainListItem[];
}

/**
 * Parameters for updating a domain
 */
export interface UpdateDomainParams {
  /**
   * Domain name to update (e.g., example.com)
   */
  domain: string;
  
  /**
   * Owner contact ID
   */
  ownerc?: string;
  
  /**
   * Admin contact ID
   */
  adminc?: string;
  
  /**
   * Technical contact ID
   */
  techc?: string;
  
  /**
   * Billing contact ID
   */
  billc?: string;
  
  /**
   * Nameservers configuration
   * Most TLDs require at least 2 nameservers
   */
  nameservers?: Nameserver[];
  
  /**
   * Optional client reference ID for tracking
   */
  customer_ref?: string;
}

/**
 * Response from domain update operation
 */
export interface UpdateDomainResponse extends BaseReponse {
  data: {
    domain: string;
  };
}

/**
 * Parameters for updating a domain's auto-renew setting
 */
export interface AutoRenewDomainParams {
  /**
   * Domain name to update the auto-renew setting for
   */
  domain: string;
  
  /**
   * Auto-renew status to set
   */
  status: 'active' | 'disabled';
  
  /**
   * Optional client reference ID for tracking
   */
  customer_ref?: string;
}

/**
 * Response from domain auto-renew update operation
 */
export interface AutoRenewDomainResponse extends BaseReponse {
  data: {
    domain: string;
    auto_renew: 'active' | 'disabled';
  };
}

/**
 * Response from domain deletion
 */
export interface DeleteDomainResponse extends BaseReponse {
  data: {
    domain: string;
  };
}
