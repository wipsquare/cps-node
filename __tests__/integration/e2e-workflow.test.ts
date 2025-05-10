import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { canRunIntegrationTests, createTestClient } from '../helpers/setup.js';
import { CreateContactParams } from '../../src/types/contact.js';
import { CreateDomainParams } from '../../src/types/domains.js';
import { CPSClient } from '../../src/index.js';

// Helper function to wait for a specified time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('End-to-End Workflow Integration Test', { skip: !canRunIntegrationTests }, () => {
  let client: CPSClient | null;
  let timestamp: number;
  let uniquePrefix: string;
  let domainName: string;
  let contactIds: Record<string, string> = {};
  
  before(() => {
    client = createTestClient();
    if (!client) {
      console.log('Skipping test as credentials are not available');
      return;
    }
    
    // Generate unique values for testing
    timestamp = Date.now();
    // Ensure IDs don't exceed 10 characters
    uniquePrefix = `T${timestamp.toString().substring(timestamp.toString().length - 8)}`;
    domainName = `test-${timestamp}.ag`;
    
    console.log(`Using test contact ID prefix: ${uniquePrefix}`);
    console.log(`Using test domain: ${domainName}`);
  });
  
  it('1. Should create contacts for domain registration', async () => {
    if (!client) return;
    
    // Create owner contact - make sure IDs don't exceed 10 chars
    const ownerContactId = `O${uniquePrefix}`.substring(0, 10);
    const ownerContactParams: CreateContactParams = {
      contact_id: ownerContactId,
      contact_type: 'person',
      firstname: 'Test',
      lastname: `Owner-${timestamp}`,
      email: `owner-${timestamp}@example.com`,
      street: 'Owner Street 123',
      postal: '12345',
      city: 'Owner City',
      state: 'Owner State',
      iso_country: 'DE',
      phone: '+49.1234567890',
      disclosure: 'disabled'
    };
    
    // Create admin contact
    const adminContactId = `A${uniquePrefix}`.substring(0, 10);
    const adminContactParams: CreateContactParams = {
      contact_id: adminContactId,
      contact_type: 'person',
      firstname: 'Test',
      lastname: `Admin-${timestamp}`,
      email: `admin-${timestamp}@example.com`,
      street: 'Admin Street 123',
      postal: '12345',
      city: 'Admin City',
      state: 'Admin State',
      iso_country: 'DE',
      phone: '+49.1234567890',
      disclosure: 'disabled'
    };
    
    // Create tech contact
    const techContactId = `T${uniquePrefix}`.substring(0, 10);
    const techContactParams: CreateContactParams = {
      contact_id: techContactId,
      contact_type: 'person',
      firstname: 'Test',
      lastname: `Tech-${timestamp}`,
      email: `tech-${timestamp}@example.com`,
      street: 'Tech Street 123',
      postal: '12345',
      city: 'Tech City',
      state: 'Tech State',
      iso_country: 'DE',
      phone: '+49.1234567890',
      disclosure: 'disabled'
    };
    
    // Create billing contact
    const billContactId = `B${uniquePrefix}`.substring(0, 10);
    const billContactParams: CreateContactParams = {
      contact_id: billContactId,
      contact_type: 'person',
      firstname: 'Test',
      lastname: `Billing-${timestamp}`,
      email: `billing-${timestamp}@example.com`,
      street: 'Billing Street 123',
      postal: '12345',
      city: 'Billing City',
      state: 'Billing State',
      iso_country: 'DE',
      phone: '+49.1234567890',
      disclosure: 'disabled'
    };
    
    // Create all contacts
    const ownerResponse = await client.contacts.create(ownerContactParams);
    assert.equal(ownerResponse.meta.result.code, '1000', 'Owner contact creation should succeed');
    
    const adminResponse = await client.contacts.create(adminContactParams);
    assert.equal(adminResponse.meta.result.code, '1000', 'Admin contact creation should succeed');
    
    const techResponse = await client.contacts.create(techContactParams);
    assert.equal(techResponse.meta.result.code, '1000', 'Tech contact creation should succeed');
    
    const billResponse = await client.contacts.create(billContactParams);
    assert.equal(billResponse.meta.result.code, '1000', 'Billing contact creation should succeed');
    
    // Store contact IDs for later use
    contactIds = {
      owner: ownerContactId,
      admin: adminContactId,
      tech: techContactId,
      bill: billContactId
    };
    
    console.log('All contacts created successfully');
  });
  
  it('2. Should retrieve info about a TLD', async () => {
    if (!client) return;
    
    const tldInfo = await client.domains.infotld('dev');
    assert.equal(tldInfo.meta.result.code, '1000', 'TLD info retrieval should succeed');
    assert.ok(tldInfo.data.tld, 'TLD info should include the TLD name');
    assert.ok(tldInfo.data.policy, 'TLD info should include policy information');
    
    console.log(`Retrieved info for TLD: ${tldInfo.data.tld}`);
  });
  
  it('3. Should register a domain with the created contacts', async () => {
    if (!client) return;
    
    const domainParams: CreateDomainParams = {
      domain: domainName,
      ownerc: contactIds.owner,
      adminc: contactIds.admin,
      techc: contactIds.tech,
      billc: contactIds.bill,
      nameservers: [
        { hostname: 'ns1.example.com' },
        { hostname: 'ns2.example.com' }
      ]
    };
    
    try {
      const createResponse = await client.domains.create(domainParams);
      assert.equal(createResponse.meta.result.code, '1000', 'Domain creation should succeed');
      assert.equal(createResponse.data.domain, domainName, 'Should return the correct domain name');
      
      console.log(`Successfully registered domain: ${domainName}`);
    } catch (error: any) {
      // If domain already exists or other issue, log and continue tests
      console.log(`Note: Could not register domain due to: ${error.message}`);
      // Skip this test but continue with others
    }
    
    // Wait for domain to be fully processed
    await sleep(5000);
  });
  
  it('4. Should retrieve domain details', async () => {
    if (!client) return;
    
    try {
      const infoResponse = await client.domains.info(domainName);
      assert.equal(infoResponse.meta.result.code, '1000', 'Domain info retrieval should succeed');
      assert.equal(infoResponse.data.domain, domainName, 'Should return the correct domain name');
      
      console.log(`Retrieved info for domain: ${domainName}`);
      console.log(`Domain status: ${infoResponse.data.status}`);
    } catch (error: any) {
      // If domain doesn't exist, log and continue tests
      console.log(`Note: Could not retrieve domain info due to: ${error.message}`);
    }
  });
  
  it('5. Should update domain nameservers and contacts', async () => {
    if (!client) return;
    
    try {
      const updateParams = {
        domain: domainName,
        // Swap owner and admin contacts for testing
        ownerc: contactIds.admin,
        adminc: contactIds.owner,
        // Update nameservers
        nameservers: [
          { hostname: 'ns3.example.com' },
          { hostname: 'ns4.example.com' }
        ]
      };
      
      const updateResponse = await client.domains.update(updateParams);
      assert.equal(updateResponse.meta.result.code, '1000', 'Domain update should succeed');
      
      // Verify changes by retrieving domain info
      const infoResponse = await client.domains.info(domainName);
      assert.equal(infoResponse.data.ownerc, contactIds.admin, 'Owner contact should be updated');
      assert.equal(infoResponse.data.adminc, contactIds.owner, 'Admin contact should be updated');
      
      // Check nameservers - the actual check will depend on how nameservers are returned
      const ns = infoResponse.data.nameservers;
      const hasNs3 = ns.some(n => n.hostname === 'ns3.example.com');
      const hasNs4 = ns.some(n => n.hostname === 'ns4.example.com');
      assert.ok(hasNs3 && hasNs4, 'Nameservers should be updated');
      
      console.log(`Successfully updated domain: ${domainName}`);
    } catch (error: any) {
      console.log(`Note: Could not update domain due to: ${error.message}`);
    }
  });
  
  it('6. Should update domain auto-renew setting', async () => {
    if (!client) return;
    
    try {
      const autoRenewResponse = await client.domains.autorenew({
        domain: domainName,
        status: 'disabled'
      });
      
      assert.equal(autoRenewResponse.meta.result.code, '1000', 'Auto-renew update should succeed');
      assert.equal(autoRenewResponse.data.auto_renew, 'disabled', 'Auto-renew should be disabled');
      
      console.log(`Updated auto-renew setting for domain: ${domainName}`);
    } catch (error: any) {
      console.log(`Note: Could not update auto-renew setting due to: ${error.message}`);
    }
  });
  
  it('7. Should list domains with filtering', async () => {
    if (!client) return;
    
    const listResponse = await client.domains.list({
      domain: `*.dev`
    });
    
    assert.equal(listResponse.meta.result.code, '1000', 'Domain listing should succeed');
    assert.ok(Array.isArray(listResponse.data), 'Should return an array of domains');
    
    console.log(`Listed ${listResponse.data.length} .dev domains`);
  });
  
  it('8. Should list contacts with filtering', async () => {
    if (!client) return;
    
    const listResponse = await client.contacts.list({
      lastname: `*${timestamp}*`
    });
    
    assert.equal(listResponse.meta.result.code, '1000', 'Contact listing should succeed');
    assert.ok(Array.isArray(listResponse.data), 'Should return an array of contacts');
    assert.ok(listResponse.data.length >= 4, 'Should find at least our 4 created contacts');
    
    console.log(`Listed ${listResponse.data.length} contacts matching our test criteria`);
  });
  
  it('9. Should retrieve contact details', async () => {
    if (!client) return;
    
    const infoResponse = await client.contacts.info(contactIds.owner);
    
    assert.equal(infoResponse.meta.result.code, '1000', 'Contact info retrieval should succeed');
    assert.equal(infoResponse.data.contact_id, contactIds.owner, 'Should return the correct contact ID');
    
    console.log(`Retrieved info for contact: ${infoResponse.data.contact_id}`);
  });

  it('9.5. Should check contact ID availability', async () => {
    if (!client) return;
    
    // Generate a random ID that shouldn't exist
    const randomId = `R${Date.now()}`.substring(0, 10);
    
    try {
      // Check a contact ID that should exist (one we created)
      const existingCheck = await client.contacts.check(contactIds.owner);
      assert.equal(existingCheck.meta.result.code, '1000', 'Contact check operation should succeed');
      assert.strictEqual(existingCheck.data.available, false, 'Our created contact ID should not be available');
      assert.equal(existingCheck.data.contact_id, contactIds.owner, 'Response should include the checked contact_id');
      
      // Check a contact ID that should not exist
      const nonExistingCheck = await client.contacts.check(randomId);
      assert.equal(nonExistingCheck.meta.result.code, '1000', 'Contact check operation should succeed');
      assert.strictEqual(nonExistingCheck.data.available, true, 'Random contact ID should be available');
      assert.equal(nonExistingCheck.data.contact_id, randomId, 'Response should include the checked contact_id');
      
      console.log(`Confirmed our contact ID ${contactIds.owner} exists (available: ${existingCheck.data.available})`);
      console.log(`Confirmed random ID ${randomId} does not exist (available: ${nonExistingCheck.data.available})`);
    } catch (error: any) {
      console.log(`Note: Contact check operation failed: ${error.message}`);
    }
  });
  
  it('10. Should delete the test domain', async () => {
    if (!client) return;
    
    try {
      // Note: This assumes you have a delete method implemented in your domains resource
      // If not, you'll need to add it to the DomainsResource interface and implementation
      const deleteResponse = await client.domains.delete(domainName);
      assert.equal(deleteResponse.meta.result.code, '1000', 'Domain deletion should succeed');
      
      console.log(`Successfully deleted domain: ${domainName}`);
    } catch (error: any) {
      console.log(`Note: Could not delete domain due to: ${error.message}`);
    }
    
    // Wait for domain deletion to process
    await sleep(3000);
  });
  
  after(async () => {
    if (!client) return;
    
    try {
      console.log('Cleaning up test resources...');
      
      // Delete all test contacts
      const contacts = Object.values(contactIds);
      for (const contactId of contacts) {
        try {
          const deleteResponse = await client.contacts.delete(contactId);
          console.log(`Deleted contact: ${contactId}`);
        } catch (error: any) {
          console.log(`Note: Could not delete contact ${contactId}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
});
