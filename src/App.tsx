import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/index'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CreateReviewPage from './pages/dashboard/CreateReviewPage'
import RestaurantReviewPage from './pages/restaurant-review'
import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/create-review-page" element={<CreateReviewPage />} />
          <Route path="/:slug" element={<RestaurantReviewPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App