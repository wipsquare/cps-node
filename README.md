[![Release](https://github.com/wipsquare/cps-node/actions/workflows/release.yml/badge.svg)](https://github.com/wipsquare/cps-node/actions/workflows/release.yml)

# CPS Node.js SDK
Node.js SDK for interacting with the CPS domain management API. This library provides a clean, typed interface for all CPS API operations.

## Installation
```bash
npm install @wipsquare/cps-node
```

## Quick Start
```typescript
import { CPSClient } from '@wipsquare/cps-node';

// Initialize the client
const client = new CPSClient({
  cid: 'YOUR_CID',
  user: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  apiUrl: 'YOUR_API_URL'
});

// Create a contact
const contact = await client.contacts.create({
  contact_type: 'person',
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  street: 'Example Street 123',
  postal: '12345',
  city: 'Example City',
  state: 'Example State',
  iso_country: 'DE',
  phone: '+49.1234567890',
  disclosure: 'disabled'
});

console.log(`Contact created with ID: ${contact.data.contact_id}`);

// Register a domain
const domain = await client.domains.create({
  domain: 'example.com',
  ownerc: 'CONTACT1',
  adminc: 'CONTACT2',
  techc: 'CONTACT3',
  billc: 'CONTACT4',
  nameservers: [
    { hostname: 'ns1.example.com' },
    { hostname: 'ns2.example.com' }
  ]
});

console.log(`Domain ${domain.data.domain} registered successfully`);
```
## Features
- Full TypeScript support with comprehensive type definitions
- Support for core CPS API operations:
- Contact management (create, list, info, check, delete)
- Domain operations (register, info, list, update, delete)
- TLD information retrieval
- Modern async/await API
- Detailed error handling
- Lightweight with minimal dependencies

## Upstream compatibility
The module was developed and tested with upstream ORM versions:
- `1.8.12`

## API Reference

### Client Initialization

```typescript
const client = new CPSClient({
  cid: string,        // Customer ID
  user: string,       // Username
  password: string,   // Password
  apiUrl: string,     // API endpoint URL
  timeout?: number    // Request timeout in ms (default: 30000)
});
```

### Contact Operations

```typescript
// Create a contact
const contact = await client.contacts.create({...});

// Check if a contact ID exists
const checkResult = await client.contacts.check('CONTACT1');

// Get contact details
const contactInfo = await client.contacts.info('CONTACT1');

// List contacts
const contacts = await client.contacts.list({
  lastname: 'Doe',
  // Additional filter parameters...
});

// Delete a contact
await client.contacts.delete('CONTACT1');
```

### Domain Operations

```typescript
// Get TLD information
const tldInfo = await client.domains.infotld('com');

// Register a domain
const domain = await client.domains.create({...});

// Get domain details
const domainInfo = await client.domains.info('example.com');

// List domains
const domains = await client.domains.list({
  domain: '*.com',
  // Additional filter parameters...
});

// Update domain
await client.domains.update({
  domain: 'example.com',
  ownerc: 'NEWCONTACT1',
  // Additional parameters to update...
});

// Update auto-renew setting
await client.domains.autorenew({
  domain: 'example.com',
  status: 'disabled'
});

// Delete domain
await client.domains.delete('example.com');
```



## Error Handling

The SDK uses a unified error handling approach, converting all errors (both HTTP and API-level) to `CPSError` instances:

```typescript
import { CPSClient, CPSError } from '@wipsquare/cps-node';

try {
  const contact = await client.contacts.create(params);
  // Success!
} catch (error) {
  if (error instanceof CPSError) {
    // All errors are CPSError instances
    console.error(`Error ${error.code}: ${error.message}`);
    
    // You can distinguish between network and API errors
    if (error.isNetworkError()) {
      console.error('Network or HTTP error occurred');
      // The original error is available if needed
      if (error.originalError) {
        console.error('Original error:', error.originalError);
      }
    } else {
      console.error('API-level error occurred');
      console.error('Error details:', error.detail);
    }
  } else {
    // This should rarely happen, but handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Codes
Network-related error codes:

- `HTTP_404` - Resource not found
- `HTTP_401` - Unauthorized
- `HTTP_403` - Forbidden
- `HTTP_500` - Server error
- `REQUEST_TIMEOUT` - Request timed out
- `CONNECTION_REFUSED` - Connection refused
- `HOST_NOT_FOUND` - Host not found

API-level error codes are returned directly from the CPS API.

## Dev and testing
- the integration e2e tests are supposed to be run manually before pushing

```bash
npm run test
```

- contributions are welcome, as long as things are kept tight, standard, no dependencies where it's not needed.
- use conventional commits
