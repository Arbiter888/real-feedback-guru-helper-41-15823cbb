import { Button } from "@/components/ui/button";
import { LogIn, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

export const DemoHeader = () => {
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
    <div className="flex justify-end mb-4">
      <Button 
        onClick={handleAuthClick} 
        className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C4DEF] hover:to-[#C935DE] text-white shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        Demo Dashboard
        {user ? (
          <MessageSquare className="ml-2 h-4 w-4" />
        ) : (
          <LogIn className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
};