'use client'
import { Toaster } from '@/components/ui/toaster';
import '../index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>EatUP! - Transform Your Restaurant's Review Strategy</title>
        <meta name="description" content="Boost positive reviews, increase customer retention, and gather actionable feedback with EatUP!'s innovative AI-powered platform." />
        <meta name="author" content="EatUP!" />
        <meta property="og:title" content="EatUP! - Transform Your Restaurant's Review Strategy" />
        <meta property="og:description" content="Boost positive reviews, increase customer retention, and gather actionable feedback with EatUP!'s innovative AI-powered platform." />
        <meta property="og:image" content="/lovable-uploads/50980a14-589f-4bd1-8267-536c582ff4e1.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EatUP! - Transform Your Restaurant's Review Strategy" />
        <meta name="twitter:description" content="Boost positive reviews, increase customer retention, and gather actionable feedback with EatUP!'s innovative AI-powered platform." />
        <meta name="twitter:image" content="/lovable-uploads/50980a14-589f-4bd1-8267-536c582ff4e1.png" />
        <link rel="icon" href="data:," />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div id="root">{children}</div>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}