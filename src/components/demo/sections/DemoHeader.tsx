import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

export const DemoHeader = () => {
  const handleAuthClick = () => {
      redirect("/dashboard");
  };

  return (
    <div className="flex justify-end mb-4">
      <Button 
        onClick={handleAuthClick} 
        className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C4DEF] hover:to-[#C935DE] text-white shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        Demo Dashboard
        {<MessageSquare className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};