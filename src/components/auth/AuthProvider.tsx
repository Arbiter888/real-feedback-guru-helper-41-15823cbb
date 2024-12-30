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
    // For demo purposes, we'll simulate a logged-in user
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      role: 'authenticated',
    } as User;
    
    setUser(demoUser);

    // If on login page, redirect to dashboard
    if (location.pathname === '/auth/login') {
      navigate('/dashboard');
    }
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};