import { motion } from "framer-motion";
import { Bot, Star, Gift, MessageSquare, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

interface DemoHeroSectionProps {
  onSurveyDemo: () => void;
}

export const DemoHeroSection = ({ onSurveyDemo }: DemoHeroSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <section className="relative py-12 md:py-20">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/lovable-uploads/022207d7-8d69-4714-9c28-702011f6f8f3.png"
          alt="Restaurant atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#FFE5ED]/80 to-[#FFD5E2]/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAuthClick} variant="outline">
            {user ? (
              <>
                Dashboard
                <MessageSquare className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Restaurant Login
                <LogIn className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center mb-6 md:mb-8"
        >
          <img 
            src="/lovable-uploads/50980a14-589f-4bd1-8267-536c582ff4e1.png" 
            alt="EatUP! Logo" 
            className="h-16 md:h-28 w-auto hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#1EAEDB] text-transparent bg-clip-text px-6 md:px-12 leading-tight pb-1"
        >
          Transform Your Restaurant's Review Strategy
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-2"
        >
          Boost positive reviews, increase customer retention, and gather actionable feedback with our innovative AI-powered platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-12 px-2"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Positive Review Acceleration</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Turn happy customers into brand advocates with AI-enhanced review generation and instant reward incentives
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
              <Gift className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Revisit Rewards</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Drive customer loyalty with our 4-visit reward program, turning first-time diners into regular patrons
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
              <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">AI Customer Survey</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Free up staff time with our AI-powered voice feedback system that captures detailed customer insights
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Bot className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
            <h2 className="text-xl md:text-2xl font-bold">EatUP! AI Customer Survey</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Experience our conversational AI that engages customers in natural dialogue, gathering comprehensive feedback about their dining experience while your staff focuses on service.
          </p>
          <Button
            onClick={onSurveyDemo}
            className="bg-[#E94E87] hover:bg-[#E94E87]/90 text-white font-semibold w-full md:w-auto"
          >
            Try AI Survey Demo
            <Bot className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
