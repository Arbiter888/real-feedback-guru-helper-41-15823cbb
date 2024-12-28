import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Clear any invalid session data
          await supabase.auth.signOut();
          setUser(null);
          navigate('/auth/login');
        } else if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          // Only redirect to login if not already on login page
          if (!window.location.pathname.includes('/auth/login')) {
            navigate('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setUser(null);
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth/login');
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate('/dashboard');
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESH_FAILED') {
        console.error('Token refresh failed');
        await supabase.auth.signOut();
        setUser(null);
        navigate('/auth/login');
        toast({
          title: "Session expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};