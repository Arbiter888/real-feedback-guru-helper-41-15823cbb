import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

interface EmailConnection {
  provider: string;
  email: string;
}

export const EmailProviderConnection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: connection, isLoading } = useQuery({
    queryKey: ['emailConnection', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_provider_connections')
        .select('provider, email')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data as EmailConnection | null;
    },
    enabled: !!user,
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('email_provider_connections')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Email disconnected",
        description: "Your email account has been disconnected successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error disconnecting email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { url }, error } = await supabase.functions.invoke('google-oauth-url', {
        body: { redirectUrl: window.location.origin + '/dashboard' },
      });
      
      if (error) throw error;
      window.location.href = url;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Email Connection</h3>
      {connection ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Connected to {connection.email}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => disconnectMutation.mutate()}
            disabled={disconnectMutation.isPending}
          >
            {disconnectMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your email account to send campaigns from your own address.
          </p>
          <Button
            onClick={handleGoogleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Connect with Gmail
          </Button>
        </div>
      )}
    </Card>
  );
};