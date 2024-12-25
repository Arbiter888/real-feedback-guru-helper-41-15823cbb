import { useEffect, useState } from "react";
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

interface RestaurantInfo {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
  preferredBookingMethod: 'phone' | 'website';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    restaurantName: "",
    googleMapsUrl: "",
    contactEmail: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    phoneNumber: "",
    bookingUrl: "",
    preferredBookingMethod: "phone"
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedInfo = localStorage.getItem('restaurantInfo');
    if (savedInfo) {
      setRestaurantInfo(JSON.parse(savedInfo));
    }
  }, []);

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
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard Demo</h1>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Section 1: Business Setup */}
            <section id="business-setup" className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Business Setup</h2>
                <p className="text-muted-foreground mb-6">
                  Configure your restaurant's information and create your review collection page
                </p>
                <BusinessSetupSection />
              </div>
            </section>

            {/* Section 2: Email Campaigns */}
            <section id="email-campaigns" className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Email Campaign Management</h2>
                <p className="text-muted-foreground mb-6">
                  Create and manage your email campaigns with AI-powered content generation
                </p>
                <EmailManagementSection restaurantInfo={restaurantInfo} />
              </div>
            </section>

            {/* Section 3: Review Vouchers */}
            <section id="review-vouchers" className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">AI-Powered Voucher Management</h2>
                <p className="text-muted-foreground mb-6">
                  Generate personalized vouchers based on customer review sentiment
                </p>
                <VoucherManagementSection restaurantInfo={restaurantInfo} />
              </div>
            </section>

            {/* Section 4: Analytics */}
            <section id="analytics" className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Review Page Analytics</h2>
                <p className="text-muted-foreground mb-6">
                  Track the performance of your review collection page
                </p>
                <ReviewPageAnalytics reviewPageId="" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}