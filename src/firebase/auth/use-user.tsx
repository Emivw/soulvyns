'use client';
    
import { useState, useEffect } from 'react';
import { onAuthStateChanged, Auth, User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

/**
 * Interface for the return value of the useUser hook.
 */
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * @returns {UserHookResult} An object containing the user, loading state, and error.
 */
export function useUser(): UserHookResult {
  const auth = useAuth(); // Get auth instance from context
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsLoading] = useState<boolean>(!auth.currentUser);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If no auth instance is available, we can't determine the user.
    if (!auth) {
      setUser(null);
      setIsLoading(false);
      setError(new Error("Firebase Auth instance is not available."));
      return;
    }

    // Set initial state. If currentUser is already available, we are not loading.
    const initialUser = auth.currentUser;
    setUser(initialUser);
    setIsLoading(!initialUser); // We are loading if we don't have a user yet.


    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
        setIsLoading(false);
        setError(null);
      },
      (error: Error) => {
        console.error("useUser - onAuthStateChanged error:", error);
        setUser(null);
        setIsLoading(false);
        setError(error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Rerun effect if the auth instance changes

  return { user, isUserLoading, error };
}
