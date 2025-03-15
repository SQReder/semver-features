/**
 * Type-Safe Versioned API example for the SemVer-based feature toggle library
 * 
 * This example demonstrates the recommended approach for implementing version-specific
 * APIs with complete type safety.
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

// Run the example with different versions
console.log('=== Using v1.0.0 (Basic API) ===');
await demoWithVersion('1.0.0');

console.log('\n=== Using v1.2.0 (Detailed User API) ===');
await demoWithVersion('1.2.0');

console.log('\n=== Using v1.5.0 (User Roles API) ===');
await demoWithVersion('1.5.0');

/**
 * Demonstrate type-safe versioned API with different behavior based on the version
 */
async function demoWithVersion(version: string) {
  // Initialize the feature manager with version
  const features = new SemverFeatures({ version });
  
  // Register feature toggles for different API versions
  const v2Api = features.register('api-v2', '1.2.0');
  const v3Api = features.register('api-v3', '1.5.0');
  
  console.log(`Current version: ${version}`);
  console.log(`v2 API (detailed user) enabled: ${v2Api.isEnabled}`);
  console.log(`v3 API (roles) enabled: ${v3Api.isEnabled}`);
  
  // ========================================================
  // Approach 1: Using feature-specific methods with type-safe nullable returns
  // ========================================================
  
  // Create userService with version-specific capabilities
  const userService = {
    // Base functionality - available in all versions
    async getBasicUser(id: string): Promise<UserBasic> {
      console.log('Fetching basic user info');
      const user = userData[id];
      if (!user) throw new Error(`User ${id} not found`);
      return { id: user.id, name: user.name };
    },
    
    // Version 2+ functionality - returns null when not available
    getDetailedUser: v2Api.createMethod<[string], UserDetailed>(
      (id: string): UserDetailed => {
        console.log('Fetching detailed user (v2+ API)');
        const user = userData[id];
        if (!user) throw new Error(`User ${id} not found`);
        return user;
      }
    ),
    
    // Version 3+ functionality - returns null when not available
    getUserRoles: v3Api.createMethod<[string], string[]>(
      (id: string): string[] => {
        console.log('Fetching user roles (v3+ API)');
        const user = userData[id];
        if (!user) throw new Error(`User ${id} not found`);
        return [user.role];
      }
    ),
    
    // Unified getUser that adapts to available versions
    async getUser(id: string, options?: { detailed?: boolean }): Promise<UserBasic | UserDetailed> {
      if (options?.detailed && v2Api.isEnabled) {
        console.log('Using detailed option with v2+ API');
        return userData[id];
      }
      
      // Fallback to basic user for all versions
      return this.getBasicUser(id);
    }
  };
  
  try {
    // Common functionality - works in all versions
    const basicUser = await userService.getBasicUser('user1');
    
  } catch (e) {
    console.error('Error:', (e as Error).message);
  }
} 