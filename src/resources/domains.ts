import { ApiClient } from '../core/api-client.js';
import { ApiTransaction } from '../types/api-core.js';
import { CPSError } from '../errors/index.js';
import {
  InfoTldResponse,
  TldInfo,
  WorkflowItem,
  FaqTopic,
  CreateDomainParams,
  CreateDomainResponse,
  InfoDomainResponse,
  Nameserver,
  LifeCycle,
  DomainInfo,
  ListDomainsParams,
  ListDomainsResponse,
  DomainListItem,
  UpdateDomainParams,
  UpdateDomainResponse,
  AutoRenewDomainParams,
  AutoRenewDomainResponse,
  DeleteDomainResponse
} from '../types/domains.js';

/**
 * Interface for contact-related operations
 */
export interface DomainsResource {
  /**
   * Get general data about a TLD
   * @param tld - TLD
   * @returns Promise resolving to the domain information
   */
  infotld(tld: string): Promise<InfoTldResponse>;

  /**
   * Register a new domain
   * @param params - Domain registration parameters
   * @returns Promise resolving to the domain creation response
   */
  create(params: CreateDomainParams): Promise<CreateDomainResponse>;

  /**
   * Get details about a registered domain in your portolio.
   * @param domain The domain that details are requested for.
   */
  info(domain: string): Promise<InfoDomainResponse>;

  /**
   * List domains in your portfolio with optional filtering
   * @param params Parameters to filter the domain list
   * @returns Promise resolving to the list of domains
   */
  list(params?: ListDomainsParams): Promise<ListDomainsResponse>;

  /**
   * Update a domain's contact information and/or nameservers
   * @param params The domain update parameters
   * @returns Promise resolving to the update operation response
   */
  update(params: UpdateDomainParams): Promise<UpdateDomainResponse>;

  /**
   * Update a domain's auto-renew setting
   * @param params The auto-renew update parameters
   * @returns Promise resolving to the update operation response
   */
  autorenew(params: AutoRenewDomainParams): Promise<AutoRenewDomainResponse>;

  /**
 * Deletes a domain
 * @param domain Domain name to delete
 * @returns Promise resolving to the delete operation response
 */
  delete(domain: string): Promise<DeleteDomainResponse>;
}

/**
 * Creates the domains resource
 * @internal
 */
export function createDomainsResource(apiClient: ApiClient): DomainsResource {
  return {
    async infotld(tld) {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'domain',
        action: 'info',
        attribute: 'tld',
        object: tld,
        values: {}
      }

      const apiResponse = await apiClient.execute(transaction);

      // Parse the response data
      const detail = apiResponse.responseObject.result.detail;
      const values = detail.values;

      // Helper function to convert XML text values to boolean
      const toBool = (val: any): boolean =>
        val?._text === 'true' || val?._text === '1';

      // Helper function to convert XML text values to number
      const toNumber = (val: any): number =>
        val?._text ? Number(val?._text) : 0;

      // Parse FAQ topics - could be single or array
      let faqSection = undefined;
      if (values.faq) {
        let faqTopics: FaqTopic[] = [];
        if (values.faq?.topic) {
          if (Array.isArray(values.faq.topic)) {
            faqTopics = values.faq.topic.map((t: any) => ({
              title: t.title?._text || '',
              text: t.text?._text || ''
            }));
          } else {
            faqTopics = [{
              title: values.faq.topic.title?._text || '',
              text: values.faq.topic.text?._text || ''
            }];
          }
        }

        faqSection = {
          topic: faqTopics.length === 1 ? faqTopics[0] : faqTopics
        };
      }

      // Parse workflow item
      const parseWorkflowItem = (item: any): WorkflowItem => ({
        description: item.description?._text || '',
        processing_time: toNumber(item.processing_time),
        pt_unit: item.pt_unit?._text || ''
      });

      const tldInfo: TldInfo = {
        access_rights: {
          application: toBool(values.access_rights?.application),
          auto_renew: toBool(values.access_rights?.auto_renew),
          chstatus: toBool(values.access_rights?.chstatus),
          create: toBool(values.access_rights?.create),
          delegation: toBool(values.access_rights?.delegation),
          delete: toBool(values.access_rights?.delete),
          dnssec: toBool(values.access_rights?.dnssec),
          host: toBool(values.access_rights?.host),
          modify: toBool(values.access_rights?.modify),
          owner_change: toBool(values.access_rights?.owner_change),
          release: toBool(values.access_rights?.release),
          restore: toBool(values.access_rights?.restore),
          transfer: toBool(values.access_rights?.transfer),
          transfer_lock: toBool(values.access_rights?.transfer_lock),
          whois_proxy: toBool(values.access_rights?.whois_proxy)
        },
        classification: values.classification?._text || '',
        config: {
          dns_check: toBool(values.config?.dns_check),
          period_yrs: toNumber(values.config?.period_yrs),
          slds: values.config?.slds?._text || '',
          transfer_auto_sync: toBool(values.config?.transfer_auto_sync)
        },
        // Only include faq if it exists
        ...(faqSection && { faq: faqSection }),
        launch_date: values.launch_date?._text || '',
        modified: values.modified?._text || '',
        policy: {
          email_validation: toBool(values.policy?.email_validation),
          expire_notification: toBool(values.policy?.expire_notification),
          owchg_notification: toBool(values.policy?.owchg_notification),
          registration_data_directory_notification: toBool(values.policy?.registration_data_directory_notification),
          transfer_authorization_notification: toBool(values.policy?.transfer_authorization_notification)
        },
        policy_url: values.policy_url?._text || '',
        rdap_url: values.rdap_url?._text || '',
        registry_name: values.registry_name?._text || '',
        remarks: values.remarks?._text || '',
        specifications: {
          legal: values.specifications?.legal?._text || '',
          tech: values.specifications?.tech?._text || ''
        },
        tld: values.tld?._text || tld,
        usage: values.usage?._text || '',
        website_url: values.website_url?._text || '',
        whois_hostname: values.whois_hostname?._text || '',
        workflow: {
          auto_renew: parseWorkflowItem(values.workflow?.auto_renew || {}),
          chstatus: parseWorkflowItem(values.workflow?.chstatus || {}),
          create: parseWorkflowItem(values.workflow?.create || {}),
          delegation: parseWorkflowItem(values.workflow?.delegation || {}),
          delete: parseWorkflowItem(values.workflow?.delete || {}),
          dnssec: parseWorkflowItem(values.workflow?.dnssec || {}),
          host: parseWorkflowItem(values.workflow?.host || {}),
          modify: parseWorkflowItem(values.workflow?.modify || {}),
          owner_change: parseWorkflowItem(values.workflow?.owner_change || {}),
          release: parseWorkflowItem(values.workflow?.release || {}),
          restore: parseWorkflowItem(values.workflow?.restore || {}),
          transfer: parseWorkflowItem(values.workflow?.transfer || {}),
          transfer_lock: parseWorkflowItem(values.workflow?.transfer_lock || {}),
          whois_proxy: parseWorkflowItem(values.workflow?.whois_proxy || {})
        }
      };

      const response: InfoTldResponse = {
        data: tldInfo,
        meta: apiResponse.meta
      };

      return response;
    },

    async create(params) {
      const { domain, customer_ref, nameservers, ...restParams } = params;

      let values: any[] = [
        { ownerc: restParams.ownerc },
        { adminc: restParams.adminc },
        { techc: restParams.techc },
        { billc: restParams.billc }
      ]
      // Add each nameserver as a separate object with a dns property
      nameservers.forEach(ns => {
        values.push({
          dns: {
            hostname: ns.hostname || '',
            hostip: ns.hostip || ''
          }
        });
      });

      const transaction: any = {
        group: 'domain',
        action: 'create',
        attribute: 'domain',
        object: domain,
        ...(customer_ref ? { customer_ref } : {}),
        values
      };

      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);

      const response: CreateDomainResponse = {
        data: {
          domain: domain
        },
        meta: apiResponse.meta
      };

      return response;
    },

    async info(domain: string): Promise<InfoDomainResponse> {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'domain',
        action: 'info',
        attribute: 'domain',
        object: domain,
        values: {}
      };

      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);

      // Parse the details from the response
      const values = apiResponse.responseObject.result.detail.values;

      // Helper function to convert XML text values to boolean
      const toBool = (val: any): boolean =>
        val?._text === 'true' || val?._text === '1';

      // Parse nameservers from dns field - always return as array
      const nameservers: Nameserver[] = [];
      if (values.dns) {
        if (Array.isArray(values.dns)) {
          nameservers.push(...values.dns.map((dns: any) => ({
            hostname: dns.hostname?._text || '',
            // Include hostip if it exists in the response
            ...(dns.hostip?._text && { hostip: dns.hostip._text })
          })));
        } else {
          nameservers.push({
            hostname: values.dns.hostname?._text || '',
            // Include hostip if it exists in the response
            ...(values.dns.hostip?._text && { hostip: values.dns.hostip._text })
          });
        }
      }

      // Parse life cycle entries - always return as array
      const lifeCycles: LifeCycle[] = [];
      if (values.life_cycle) {
        if (Array.isArray(values.life_cycle)) {
          lifeCycles.push(...values.life_cycle.map((lc: any) => ({
            keydate: lc.keydate?._text || '',
            period: lc.period?._text || ''
          })));
        } else {
          lifeCycles.push({
            keydate: values.life_cycle.keydate?._text || '',
            period: values.life_cycle.period?._text || ''
          });
        }
      }

      // Build the domain info object
      const domainInfo: DomainInfo = {
        adminc: values.adminc?._text || '',
        auth_info: values.auth_info?._text || '',
        authinfo: {
          pw: values.authinfo?.pw?._text || '',
          validity: values.authinfo?.validity?._text || ''
        },
        billc: values.billc?._text || '',
        child_host: values.child_host?._text || '',
        chreseller_auth: values.chreseller_auth?._text || '',
        created: values.created?._text || '',
        created_by: values.created_by?._text || '',
        dataquality: values.dataquality?._text || '',
        nameservers: nameservers, // Renamed to nameservers for consistency
        dnssec: values.dnssec?._text || '',
        domain: values.domain?._text || domain,
        expire: values.expire?._text || '',
        external_roid: values.external_roid?._text || '',
        keydate: values.keydate?._text || '',
        life_cycle: lifeCycles,
        modified: values.modified?._text || '',
        modified_by: values.modified_by?._text || '',
        native_domain: values.native_domain?._text || '',
        options: {
          auto_renew: values.options?.auto_renew?._text as ('active' | 'disabled') || 'disabled',
          delegation: values.options?.delegation?._text as ('active' | 'disabled') || 'disabled',
          transfer_lock: values.options?.transfer_lock?._text as ('active' | 'disabled') || 'disabled',
          whois_proxy: values.options?.whois_proxy?._text as ('active' | 'disabled') || 'disabled'
        },
        ownerc: values.ownerc?._text || '',
        registry_sync: toBool(values.registry_sync),
        restricted: values.restricted?._text || '',
        status: values.status?._text || '',
        task: values.task?._text || '',
        techc: values.techc?._text || '',
        tld: values.tld?._text || '',
        transaction_lock: {
          reason: values.transaction_lock?.reason?._text || '',
          status: values.transaction_lock?.status?._text || ''
        },
        user: values.user?._text || ''
      };

      const response: InfoDomainResponse = {
        data: domainInfo,
        meta: apiResponse.meta
      };

      return response;
    },

    async list(params: ListDomainsParams = {}): Promise<ListDomainsResponse> {
      // Build the transaction values
      const values: Record<string, any> = {
        domain: params.domain || '*',
        native_domain: params.native_domain || '*',
        user: params.user || '*',
        contact_id: params.contact_id || '*',
        status: params.status || '*',
        registry_sync: params.registry_sync || '*',
        auto_renew: params.auto_renew || '*',
        transfer_lock: params.transfer_lock || '*',
        delegation: params.delegation || '*',
        whois_proxy: params.whois_proxy || '*',
        expire_begin: params.expire_begin || '',
        expire_end: params.expire_end || '',
        dataquality: params.dataquality || '*'
      };

      // Add nameserver filters if specified
      if (params.nameservers && params.nameservers.length > 0) {
        // Add each nameserver as a dns element
        for (let i = 0; i < 5; i++) {
          const ns = params.nameservers[i] || { hostname: '*' };
          values[`dns${i + 1}`] = { hostname: ns.hostname };
        }
      } else {
        // Default - search for all nameservers
        for (let i = 0; i < 5; i++) {
          values[`dns${i + 1}`] = { hostname: '*' };
        }
      }

      // Prepare the transaction
      const transaction: ApiTransaction<any> = {
        group: 'domain',
        action: 'list',
        attribute: 'domain',
        values: []
      };

      // Convert the values object to array structure expected by api-client
      for (const key in values) {
        if (key.startsWith('dns')) {
          transaction.values.push({
            dns: { hostname: values[key].hostname }
          });
        } else {
          transaction.values.push({ [key]: values[key] });
        }
      }

      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);

      // Parse the domain list from the response
      const domainList = parseDomainListFromResponse(apiResponse.responseObject.result.detail);

      return {
        data: domainList,
        meta: apiResponse.meta
      };
    },

    async update(params: UpdateDomainParams): Promise<UpdateDomainResponse> {
      const { domain, customer_ref, nameservers, ...contactDetails } = params;

      // First, fetch the current domain information
      const currentDomainInfo = await this.info(domain);

      // Prepare the values array with all required fields
      const values: any[] = [
        // Use provided contact IDs or fall back to current values
        { ownerc: contactDetails.ownerc || currentDomainInfo.data.ownerc },
        { adminc: contactDetails.adminc || currentDomainInfo.data.adminc },
        { techc: contactDetails.techc || currentDomainInfo.data.techc },
        { billc: contactDetails.billc || currentDomainInfo.data.billc }
      ];

      // Determine which nameservers to use
      const nsToUse = nameservers || currentDomainInfo.data.nameservers;

      // Always include 5 nameserver entries (the API expects exactly 5)
      for (let i = 0; i < 5; i++) {
        const ns = i < nsToUse.length ? nsToUse[i] : { hostname: '' };
        values.push({
          dns: {
            hostname: ns.hostname || '',
            ...(ns.hostip ? { hostip: ns.hostip } : {})
          }
        });
      }

      // Prepare the transaction
      const transaction: ApiTransaction<any> = {
        group: 'domain',
        action: 'modify',
        attribute: 'domain',
        object: domain,
        ...(customer_ref ? { customer_ref } : {}),
        values
      };

      // Execute the transaction
      const apiResponse = await apiClient.execute(transaction);

      // Extract the active_transactions_id from the response
      const active_transactions_id = apiResponse.meta.transaction.active_transactions_id || '';

      // Format the response
      const response: UpdateDomainResponse = {
        data: {
          domain: domain
        },
        meta: apiResponse.meta
      };

      return response;
    },

    async autorenew(params) {
      const { domain, status, customer_ref } = params;

      // Validate status
      if (status !== 'active' && status !== 'disabled') {
        throw new CPSError(
          `Invalid auto-renew status: ${status}. Must be 'active' or 'disabled'.`,
          'INVALID_PARAM',
          { status },
          null
        );
      }

      // Prepare the transaction
      const transaction: ApiTransaction<{ status: string }> = {
        group: 'domain',
        action: 'modify',
        attribute: 'auto_renew',
        object: domain,
        ...(customer_ref ? { customer_ref } : {}),
        values: { status }
      };

      // Execute the transaction
      const apiResponse = await apiClient.execute(transaction);

      // Format the response
      const response: AutoRenewDomainResponse = {
        data: {
          domain: domain,
          auto_renew: status
        },
        meta: apiResponse.meta
      };

      return response;
    },

    async delete(domain: string): Promise<DeleteDomainResponse> {
      const transaction: ApiTransaction<Record<string, never>> = {
        group: 'domain',
        action: 'delete',
        attribute: 'domain',
        object: domain,
        values: {}
      };
    
      // Get response from API client
      const apiResponse = await apiClient.execute(transaction);
    
      const response: DeleteDomainResponse = {
        data: {
          domain: domain
        },
        meta: apiResponse.meta
      };
    
      return response;
    }
  }
}

/**
 * Parse domain list from the API response detail
 * @private
 */
function parseDomainListFromResponse(detail: any): DomainListItem[] {
  if (!detail || !detail.values) {
    return [];
  }

  // If there's a single values object
  if (!Array.isArray(detail.values)) {
    return [parseDomainValues(detail.values)];
  }

  // If there's an array of values objects
  return detail.values.map((item: any) => parseDomainValues(item));
}

/**
 * Parse a single domain values object from the API response
 * @private
 */
function parseDomainValues(values: any): DomainListItem {
  // Helper function to convert XML text values to boolean
  const toBool = (val: any): boolean =>
    val?._text === 'true' || val?._text === '1';

  // Parse nameservers from dns field - always return as array
  const nameservers: Nameserver[] = [];
  if (values.dns) {
    if (Array.isArray(values.dns)) {
      nameservers.push(...values.dns.map((dns: any) => ({
        hostname: dns.hostname?._text || '',
        // Include hostip if it exists in the response
        ...(dns.hostip?._text && { hostip: dns.hostip._text })
      })));
    } else {
      nameservers.push({
        hostname: values.dns.hostname?._text || '',
        // Include hostip if it exists in the response
        ...(values.dns.hostip?._text && { hostip: values.dns.hostip._text })
      });
    }
  }

  return {
    domain: values.domain?._text || '',
    native_domain: values.native_domain?._text || '',
    status: values.status?._text || '',
    registry_sync: toBool(values.registry_sync),
    dataquality: values.dataquality?._text || '',
    created: values.created?._text || '',
    modified: values.modified?._text || '',
    expire: values.expire?._text || '',
    keydate: values.keydate?._text || '',
    ownerc: values.ownerc?._text || '',
    adminc: values.adminc?._text || '',
    techc: values.techc?._text || '',
    billc: values.billc?._text || '',
    nameservers: nameservers,
    options: {
      auto_renew: values.options?.auto_renew?._text as ('active' | 'disabled') || 'disabled',
      delegation: values.options?.delegation?._text as ('active' | 'disabled') || 'disabled',
      transfer_lock: values.options?.transfer_lock?._text as ('active' | 'disabled') || 'disabled',
      whois_proxy: values.options?.whois_proxy?._text as ('active' | 'disabled') || 'disabled'
    },
    user: values.user?._text || '',
    transaction_lock: {
      status: values.transaction_lock?.status?._text || ''
    }
  };
}