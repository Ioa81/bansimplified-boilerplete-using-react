// Placeholder for username, can expand later
export interface Username {}

// Supabase Auth user
export interface AuthUser {
  id: string;
  aud: string; // audience, usually "authenticated"
  role: string; // role like "authenticated" or custom role
  email?: string | null;
  phone?: string | null;
  app_metadata: {
    provider: string; // e.g., "email", "google", etc.
    providers: string[];
  };
  user_metadata: Record<string, any>; // custom metadata
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface User {
  id: string | number;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  zipcode?: string | null;
  role: 'customer' | 'staff' | 'admin' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

// Minimal internal subset (can be derived from User)
export type UserData = Pick<User, 'id' | 'firstname' | 'lastname' | 'email' | 'role' | 'status'>;
