import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CreateReviewPage from "@/pages/dashboard/CreateReviewPage";
import EmailCampaignsPage from "@/pages/dashboard/EmailCampaignsPage";
import ReviewVouchersPage from "@/pages/dashboard/ReviewVouchersPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/create-review-page" element={<CreateReviewPage />} />
      <Route path="/dashboard/email-campaigns" element={<EmailCampaignsPage />} />
      <Route path="/dashboard/review-vouchers" element={<ReviewVouchersPage />} />
      <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;