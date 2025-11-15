'use client';

import { 
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase-client';
import { AdminUser, AdminRole } from './types';

export interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
}

/**
 * Sign in with custom token (from server)
 */
export async function signInWithToken(customToken: string): Promise<{ user: User; adminUser: AdminUser | null }> {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithCustomToken(auth, customToken);
  const user = userCredential.user;
  
  // Fetch admin user data
  const adminUser = await getAdminUserData(user.uid);
  
  return { user, adminUser };
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{ user: User; adminUser: AdminUser | null }> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  
  // Fetch admin user data
  const adminUser = await getAdminUserData(user.uid);
  
  return { user, adminUser };
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Get admin user data from Firestore
 */
async function getAdminUserData(uid: string): Promise<AdminUser | null> {
  try {
    // This will be implemented with API route that uses Admin SDK
    const response = await fetch(`/api/auth/user/${uid}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.adminUser;
  } catch (error) {
    console.error('Error fetching admin user data:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 */
export function hasAdminRole(adminUser: AdminUser | null, role: AdminRole): boolean {
  if (!adminUser) return false;
  return adminUser.role === role || adminUser.role === 'admin';
}

/**
 * Check if user has permission
 */
export function hasPermission(adminUser: AdminUser | null, permission: string): boolean {
  if (!adminUser) return false;
  if (adminUser.role === 'admin') return true;
  return adminUser.permissions.includes(permission);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (authState: AuthState) => void): () => void {
  const auth = getFirebaseAuth();
  
  return onAuthStateChanged(auth, async (user) => {
    let adminUser: AdminUser | null = null;
    
    if (user) {
      adminUser = await getAdminUserData(user.uid);
    }
    
    callback({
      user,
      adminUser,
      loading: false,
    });
  });
}

