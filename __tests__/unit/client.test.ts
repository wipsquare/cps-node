import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CPSClient } from '../../src/index.js';
import { createMockClient } from '../helpers/setup.js';

describe('CPSClient', () => {
  it('should be instantiated with API credentials', () => {
    const client = createMockClient();
    
    assert.ok(client);
    assert.equal(client.getApiUrl(), 'https://mock-api.example.com');
  });

  it('should provide default timeout', () => {
    const client = new CPSClient({
      apiUrl: 'https://api.example.com',
      user: 'testuser',
      cid: 'testcid',
      password: 'testpassword'
    });
    
    // The direct `timeout` property doesn't exist on the client
    // and we can't access private members, so we'll need to modify
    // either the test approach or add a getter for timeout
    assert.equal((client as any).httpClient.timeout, 30000);
  });
  
  it('should expose contacts resource', () => {
    const client = createMockClient();
    
    assert.ok(client.contacts);
    // Make sure we're checking for methods that actually exist on ContactsResource
    assert.strictEqual(typeof client.contacts.create, 'function');
    assert.strictEqual(typeof client.contacts.list, 'function'); // Note: changed from 'get' to 'list'
  });
});
