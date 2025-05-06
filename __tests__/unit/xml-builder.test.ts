import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildRequestXml } from '../../src/core/xml-builder.js';
import { Request, Auth, Transaction } from '../../src/types/utils.js';

describe('XML Builder', () => {
  it('should build valid XML request', () => {
    const auth: Auth = {
      cid: 'testcid',
      pwd: 'testpwd',
      user: 'testuser'
    };
    
    const transaction: Transaction<Record<string, string>> = {
      group: 'contact',
      action: 'create',
      attribute: 'contact',
      object: '%%AUTO%%',
      values: {
        name: 'Test Name',
        email: 'test@example.com'
      }
    };
    
    const request: Request<Record<string, string>> = {
      auth,
      transaction,
      lang: 'en'
    };
    
    const xml = buildRequestXml(request);
    
    // Validate structure
    assert.ok(xml.includes('<?xml version="1.0" encoding="utf-8" ?>'));
    assert.ok(xml.includes('<request>'));
    assert.ok(xml.includes('<auth>'));
    // ... rest of assertions
  });
  
  // ... other unit tests
});
