import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BusinessSetupSection } from "@/components/dashboard/sections/BusinessSetupSection";
import { VoucherManagementSection } from "@/components/demo/email/vouchers/VoucherManagementSection";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Section 1: Business Setup */}
            <BusinessSetupSection />

            {/* Section 2: Review Vouchers */}
            <section id="review-vouchers" className="space-y-8">
              <VoucherManagementSection />
            </section>

            {/* Section 3: Email Campaigns */}
            <section id="email-campaigns" className="space-y-8">
              <EmailManagementSection />
            </section>

            {/* Section 4: Analytics */}
            <section id="analytics" className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg">
                <ReviewPageAnalytics reviewPageId="" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}