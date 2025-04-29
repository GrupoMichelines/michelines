import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    // Qualquer usuário autenticado tem acesso
    return !!user;
  }, [user]);

  const handleAuthStateChange = useCallback((user: User | null) => {
    console.log('Auth state changed:', user?.email);
    setUser(user);
    setLoading(false);
    setError(null);
  }, []);

  const handleAuthError = useCallback((error: Error) => {
    console.error('Erro no listener de autenticação:', error);
    setError(error.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange, handleAuthError);
    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, [handleAuthStateChange, handleAuthError]);

  return { 
    user, 
    loading, 
    error,
    isAuthenticated: !!user,
    isAdmin
  };
} 