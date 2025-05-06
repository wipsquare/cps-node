import 'dotenv/config';
import { CPSClient } from '../../src/index.js';

// Get credentials from environment
export const CPS_URL = process.env.CPS_URL;
export const CPS_USER = process.env.CPS_USER;
export const CPS_CID = process.env.CPS_CID; 
export const CPS_PWD = process.env.CPS_PWD;

// Check if we can run integration tests
export const canRunIntegrationTests = 
  Boolean(CPS_URL && CPS_USER && CPS_CID && CPS_PWD);

/**
 * Creates a test client using environment credentials
 */
export function createTestClient(): CPSClient | null {
  if (!canRunIntegrationTests) {
    return null;
  }
  
  return new CPSClient({
    apiUrl: CPS_URL!,
    user: CPS_USER!,
    cid: CPS_CID!,
    password: CPS_PWD!
  });
}

/**
 * Creates a mock client for unit tests
 */
export function createMockClient(): CPSClient {
  return new CPSClient({
    apiUrl: 'https://mock-api.example.com',
    user: 'mockuser',
    cid: 'mockcid',
    password: 'mockpassword'
  });
}
