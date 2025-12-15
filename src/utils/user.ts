// src/utils/user.ts
import { supabase } from '@/lib/supabase';
import type { AuthUser, User, UserData } from '@/types/users';
import type { Session } from '@supabase/supabase-js';

/* --------------------------- OAuth Helpers --------------------------- */
export function getOAuthRedirectUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getOAuthRedirectUrl(),
      queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined,
    },
  });

  if (error) throw error;
}

export async function finalizeOAuthSignIn(code: string): Promise<{ session: Session; user: AuthUser }> {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;

  if (!data.session || !data.user) {
    throw new Error('Invalid session data returned');
  }

  return {
    session: data.session,
    user: data.user as AuthUser,
  };
}

/* --------------------------- LocalStorage Helpers --------------------------- */
const STORAGE_KEYS = {
  USER_DATA: 'userData',
  PENDING_OAUTH_SIGNUP: 'pendingOAuthSignup',
  REMEMBER_ME: 'rememberMe',
} as const;

const isBrowser = (): boolean => typeof window !== 'undefined';

export const saveUserDataToLocalStorage = (userData: UserData): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserDataFromLocalStorage = (): UserData | null => {
  if (!isBrowser()) return null;

  const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    // Validate the structure
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'email' in parsed &&
      'role' in parsed &&
      'status' in parsed
    ) {
      return parsed as UserData;
    }

    // Invalid structure, clean up
    clearUserDataFromLocalStorage();
    return null;
  } catch {
    // Invalid JSON, clean up
    clearUserDataFromLocalStorage();
    return null;
  }
};

export const clearUserDataFromLocalStorage = (): void => {
  if (!isBrowser()) return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export interface PendingOAuthSignupData {
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  [key: string]: any;
}

export const savePendingOAuthSignup = (formData: PendingOAuthSignupData): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP, JSON.stringify(formData));
};

export const getPendingOAuthSignup = (): PendingOAuthSignupData | null => {
  if (!isBrowser()) return null;

  const data = localStorage.getItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    clearPendingOAuthSignup();
    return null;
  }
};

export const clearPendingOAuthSignup = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.PENDING_OAUTH_SIGNUP);
};

export const saveRememberMePreference = (remember: boolean): void => {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, remember.toString());
};

export const shouldRememberUser = (): boolean => {
  if (!isBrowser()) return false;
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
};

/* --------------------------- Profile Helpers --------------------------- */
export async function ensureUserProfile(
  session: Session,
  formData: Partial<User> | null = null
): Promise<User> {
  if (!session?.user?.id) {
    throw new Error('Invalid session: No user ID found');
  }

  const userId = session.user.id;

  // Check if user profile already exists
  const { data: existing, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching user profile:', fetchError);
    throw fetchError;
  }

  if (existing) {
    return existing as User;
  }

  // Create new profile from available data
  const metadata = session.user.user_metadata ?? {};
  const nameParts = metadata.full_name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const profile: User = {
    id: userId,
    email: session.user.email || '',
    firstname: formData?.firstname || metadata.firstname || firstName || 'User',
    lastname: formData?.lastname || metadata.lastname || lastName || '',
    phone: formData?.phone || metadata.phone || null,
    address: formData?.address || metadata.address || null,
    city: formData?.city || metadata.city || null,
    zipcode: formData?.zipcode || metadata.zipcode || null,
    role: 'customer',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Insert new profile
  const { data: inserted, error: insertError } = await supabase
    .from('users')
    .insert(profile)
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user profile:', insertError);

    // Return the profile object we tried to insert (without database ID)
    // This maintains consistency even if DB insert fails
    return profile;
  }

  return inserted as User;
}

export const convertProfileToUserData = (profile: User): UserData => ({
  id: profile.id,
  firstname: profile.firstname ?? null,
  lastname: profile.lastname ?? null,
  email: profile.email,
  role: profile.role,
  status: profile.status,
});

export const saveUserIfRemember = (user: User): void => {
  if (shouldRememberUser() && user) {
    saveUserDataToLocalStorage(convertProfileToUserData(user));
  }
};

export const hasAdminDashboardAccess = (
  role: string,
  status: string = 'active'
): boolean => {
  const adminRoles = ['admin', 'manager', 'staff'];
  return adminRoles.includes(role) && status === 'active';
};

/* --------------------------- Current User --------------------------- */
export async function getCurrentUser(): Promise<UserData | null> {
  // Try to get from localStorage first
  const saved = getUserDataFromLocalStorage();
  if (saved) return saved;

  // No saved data, check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error getting session:', sessionError);
    return null;
  }

  if (!session?.user?.id) {
    return null;
  }

  try {
    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role, status')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    if (!profile) {
      return null;
    }

    const userData = convertProfileToUserData(profile as User);

    // Save to localStorage if remember me is enabled
    if (shouldRememberUser()) {
      saveUserDataToLocalStorage(userData);
    }

    return userData;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
}

/* --------------------------- Logout Helper --------------------------- */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }

  clearUserDataFromLocalStorage();
}

/* --------------------------- User Validation --------------------------- */
export function isValidUserData(data: any): data is UserData {
  return (
    data &&
    typeof data === 'object' &&
    'id' in data &&
    'email' in data &&
    typeof data.email === 'string' &&
    'role' in data &&
    'status' in data
  );
}

export function getUserFullName(user: User | UserData): string {
  const parts = [user.firstname, user.lastname].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : user.email;
}
