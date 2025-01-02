import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/restaurant-review');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // For demo purposes, we'll simulate a logged-in user and set up the Supabase session
    const setupDemoUser = async () => {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@example.com',
        role: 'authenticated',
      } as User;
      
      // Set the demo user in state
      setUser(demoUser);

      // Set up the Supabase session for the demo user
      await supabase.auth.setSession({
        access_token: 'demo-token',
        refresh_token: 'demo-refresh-token',
      });

      // If on login page, redirect to dashboard
      if (location.pathname === '/auth/login') {
        navigate('/dashboard');
      }
    };

    setupDemoUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};