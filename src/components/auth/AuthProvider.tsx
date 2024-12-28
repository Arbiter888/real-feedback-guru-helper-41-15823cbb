import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthError = async (error: AuthError | null) => {
    if (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setUser(null);
      if (!location.pathname.startsWith('/auth/login') && !location.pathname.match(/^\/[^/]+$/)) {
        navigate('/auth/login');
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          await handleAuthError(error);
        } else if (session) {
          setUser(session.user);
          // Only redirect to dashboard if on login page
          if (location.pathname === '/auth/login') {
            navigate('/dashboard');
          }
        } else {
          setUser(null);
          if (!location.pathname.startsWith('/auth/login') && !location.pathname.match(/^\/[^/]+$/)) {
            navigate('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setUser(null);
        if (!location.pathname.match(/^\/[^/]+$/)) {
          navigate('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (!location.pathname.match(/^\/[^/]+$/)) {
          navigate('/auth/login');
        }
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate('/dashboard');
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};