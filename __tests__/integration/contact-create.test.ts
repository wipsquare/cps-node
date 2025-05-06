import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateContactParams } from '../../src/types/contact.js';
import { canRunIntegrationTests, createTestClient } from '../helpers/setup.js';

describe('Contact Creation Integration Test', { skip: !canRunIntegrationTests }, () => {
  it('should successfully create a contact with auto-generated ID', async () => {
    // Get a test client from the setup helper
    const client = createTestClient();
    
    // Skip if we couldn't create a client
    if (!client) {
      console.log('Skipping test as credentials are not available');
      return;
    }

    // Generate unique values for testing
    const timestamp = Date.now();
    const uniqueEmail = `test-${timestamp}@example.com`;

    // Create contact parameters (with auto-generated ID)
    const contactParams: CreateContactParams = {
      contact_type: 'organisation',
      orgname: `Test Organization ${timestamp}`,
      firstname: 'Test',
      lastname: `User-${timestamp}`,
      email: uniqueEmail,
      street: 'Test Street 123',
      postal: '12345',
      city: 'Test City',
      state: 'Test State',
      iso_country: 'DE',
      phone: '+49.1234567890',
      disclosure: 'disabled'
    };

    try {
      // Call the API
      const response = await client.contacts.create(contactParams);

      // Verify the response structure
      assert.ok(response, 'Response should exist');
      assert.ok(response.result, 'Response should have result property');
      assert.equal(response.result.code, '1000', 'Should have success code');
      assert.ok(response.result.detail, 'Should have a detail message');
      assert.ok(response.result.message, 'Should have a message');
      
      // Verify transaction info
      assert.ok(response.transaction, 'Response should have transaction property');
      assert.ok(response.transaction.active_transactions_id, 'Should have a transaction ID');
      assert.ok(response.transaction.created, 'Should have a creation timestamp');
      
      // Verify auto-generated contact ID
      assert.ok(response.result.auto_values, 'Should have auto_values for auto-generated ID');
      assert.ok(response.result.auto_values.contact_id, 'Should have generated contact_id');
      
      // Log success info
      console.log(`Successfully created contact with ID: ${response.result.auto_values.contact_id}`);
      console.log(`Transaction ID: ${response.transaction.active_transactions_id}`);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error; // Re-throw to fail the test
    }
  });

  it('should successfully create a contact with specified ID', async () => {
    // Get a test client from the setup helper
    const client = createTestClient();
    
    // Skip if we couldn't create a client
    if (!client) {
      console.log('Skipping test as credentials are not available');
      return;
    }

    // Generate unique values for testing
    const timestamp = Date.now();
    const uniqueEmail = `test-${timestamp}@example.com`;
    const uniqueId = `TEOV66`; 

    // Create contact parameters (with specified ID)
    const contactParams: CreateContactParams = {
      objectId: uniqueId,
      contact_type: 'person',
      firstname: 'Jane',
      lastname: `Doe-${timestamp}`,
      email: uniqueEmail,
      street: 'Another Street 456',
      postal: '54321',
      city: 'Another City',
      state: 'Another State',
      iso_country: 'US',
      phone: '+1.2345678901',
      disclosure: 'active'
    };

    try {
      // Call the API
      const response = await client.contacts.create(contactParams);
      process.stdout.write(JSON.stringify(response, null, 2) + '\n');
      // Verify the response structure
      assert.ok(response, 'Response should exist');
      assert.ok(response.result, 'Response should have result property');
      assert.equal(response.result.code, '1000', 'Should have success code');
      assert.ok(response.result.detail, 'Should have a detail message');
      assert.ok(response.result.message, 'Should have a message');
      
      // Verify transaction info
      assert.ok(response.transaction, 'Response should have transaction property');
      assert.ok(response.transaction.active_transactions_id, 'Should have a transaction ID');
      assert.ok(response.transaction.created, 'Should have a creation timestamp');
      
      // For specified ID, auto_values should NOT be present
      assert.strictEqual(response.result.auto_values, undefined, 
        'Should not have auto_values when using specified ID');
      
      // Log success info
      console.log(`Successfully created contact with specified ID: ${uniqueId}`);
      console.log(`Transaction ID: ${response.transaction.active_transactions_id}`);
    } catch (error) {
      console.error('Error creating contact with specified ID:', error);
      throw error; // Re-throw to fail the test
    }
  });
});
