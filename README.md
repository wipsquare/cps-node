## Error Handling

The SDK throws two types of errors:

- **AxiosError**: For HTTP-level issues (network errors, timeouts, etc.)
- **CPSError**: For API-level errors (validation issues, business logic errors)

```typescript
import { CPSClient, CPSError } from '@wipsquare/cps-node-sdk';
import { isAxiosError } from 'axios';

try {
  const contact = await client.contacts.create(params);
  // Success!
} catch (error) {
  if (isAxiosError(error)) {
    // HTTP or network error
    console.error(`HTTP Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
    }
  } else if (error instanceof CPSError) {
    // API-level error
    console.error(`API Error ${error.code}: ${error.message}`);
    console.error(`Details: ${error.detail}`);
  } else {
    // Unexpected error
    console.error('Unexpected error:', error);
  }
}
