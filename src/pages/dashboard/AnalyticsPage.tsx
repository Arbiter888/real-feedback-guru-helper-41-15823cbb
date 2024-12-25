import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <div className="bg-white rounded-xl shadow-lg">
              <ReviewPageAnalytics reviewPageId="" />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}