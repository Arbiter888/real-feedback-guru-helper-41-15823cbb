import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedUrl, setGeneratedUrl] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (generatedUrl) {
      navigate(generatedUrl);
    }
  }, [generatedUrl, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Create Your Review Page</h2>
            <p className="text-muted-foreground mb-6">
              Start collecting reviews and managing your restaurant's online presence
            </p>
            <CreateReviewPageButton setGeneratedUrl={setGeneratedUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}