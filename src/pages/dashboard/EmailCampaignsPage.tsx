import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";

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

export default function EmailCampaignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
            <EmailManagementSection restaurantInfo={restaurantInfo} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}