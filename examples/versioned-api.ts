/**
 * Versioned API example for the SemVer-based feature toggle library
 */
import { SemverFeatures } from '../src';

// Define user types
interface UserBasic {
  id: string;
  name: string;
}

interface UserDetailed extends UserBasic {
  email: string;
  role: string;
  lastLogin: string;
}

// Mock data
const userData: Record<string, UserDetailed> = {
  'user1': {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    lastLogin: '2023-04-10T10:30:00Z'
  },
  'user2': {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    lastLogin: '2023-04-15T14:20:00Z'
  }
};

// Initialize feature manager with different versions to test API versions
console.log('=== Using v1.0.0 ===');
demoWithVersion('1.0.0');

console.log('\n=== Using v1.2.0 ===');
demoWithVersion('1.2.0');

console.log('\n=== Using v1.5.0 ===');
demoWithVersion('1.5.0');

async function demoWithVersion(version: string) {
  const features = new SemverFeatures({ version });
  
  // Create versioned API with different implementations
  const userApi = features.createVersionedApi('userApi', {
    versions: {
      // v3 API - available in v1.5.0+
      v3: {
        minVersion: '1.5.0',
        getUser: async (id: string, options: { detailed?: boolean } = {}): Promise<UserBasic | UserDetailed> => {
          console.log('Using v3 API');
          const user = userData[id];
          if (!user) throw new Error(`User ${id} not found`);
          
          // v3 directly supports the detailed option
          return options.detailed ? user : { id: user.id, name: user.name };
        },
        
        // New method only available in v3
        getUserRoles: async (id: string): Promise<string[]> => {
          console.log('Using getUserRoles from v3 API');
          const user = userData[id];
          if (!user) throw new Error(`User ${id} not found`);
          return [user.role];
        }
      },
      
      // v2 API - available in v1.2.0+
      v2: {
        minVersion: '1.2.0',
        getUser: async (id: string, options: { detailed?: boolean } = {}): Promise<UserBasic | UserDetailed> => {
          console.log('Using v2 API');
          const user = userData[id];
          if (!user) throw new Error(`User ${id} not found`);
          
          // v2 supports the detailed option
          return options.detailed ? user : { id: user.id, name: user.name };
        }
      },
      
      // v1 API - always available as fallback
      v1: {
        minVersion: '0.0.0',
        getUser: async (id: string): Promise<UserBasic> => {
          console.log('Using v1 API');
          const user = userData[id];
          if (!user) throw new Error(`User ${id} not found`);
          
          // v1 doesn't support detailed option, always returns basic info
          return { id: user.id, name: user.name };
        }
      }
    }
  });
  
  try {
    // The API usage is the same regardless of which version is active
    // TypeScript will enforce the common API methods between versions
    const basicUser = await userApi.getUser('user1');
    console.log('Basic user:', basicUser);
    
    try {
      // For v2 and v3, we can use the detailed option
      const detailedUser = await userApi.getUser('user2', { detailed: true });
      console.log('Detailed user:', detailedUser);
    } catch (e) {
      // Will fail for v1 since it doesn't support options
      console.log('Detailed user fetch failed:', (e as Error).message);
    }
    
    // Try to use the v3-only method
    try {
      // TypeScript would normally flag this as an error since it's not available in all versions
      // For demo purposes, we use a type cast
      const roles = await (userApi as any).getUserRoles('user2');
      console.log('User roles:', roles);
    } catch (e) {
      console.log('getUserRoles not available:', (e as Error).message);
    }
  } catch (e) {
    console.error('Error:', (e as Error).message);
  }
} 