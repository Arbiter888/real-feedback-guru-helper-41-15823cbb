import { Bot, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonSectionProps {
  onSurveyDemo: () => void;
  onBookingDemo: () => void;
  onTakeoutDemo: () => void;
}

export const ComingSoonSection = ({ onSurveyDemo, onBookingDemo, onTakeoutDemo }: ComingSoonSectionProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#1EAEDB] text-transparent bg-clip-text">
        Coming Soon
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg relative">
          <div className="absolute top-2 right-2 bg-[#E94E87] text-white text-xs px-2 py-1 rounded-full">
            Coming Soon
          </div>
          <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
            <Bot className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">AI Survey Demo</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Experience how our AI engages with customers to gather detailed feedback in a natural, conversational way, helping restaurants improve while freeing up staff time
          </p>
          <Button
            onClick={onSurveyDemo}
            className="w-full bg-[#E94E87] hover:bg-[#E94E87]/90 text-white"
          >
            Try AI Survey Demo
            <Bot className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg relative">
          <div className="absolute top-2 right-2 bg-[#E94E87] text-white text-xs px-2 py-1 rounded-full">
            Coming Soon
          </div>
          <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
            <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">AI Agent Booking</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Let our AI booking agent handle reservations 24/7, managing your tables efficiently while providing a personalized experience
          </p>
          <Button
            onClick={onBookingDemo}
            className="w-full bg-[#E94E87] hover:bg-[#E94E87]/90 text-white"
          >
            Try Booking Demo
            <MessageSquare className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg relative">
          <div className="absolute top-2 right-2 bg-[#E94E87] text-white text-xs px-2 py-1 rounded-full">
            Coming Soon
          </div>
          <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
            <Phone className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">AI Delivery Agent</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Our AI agent handles takeout and delivery orders 24/7, managing your delivery operations through our network of drivers or your own team. Perfect for restaurants looking to offer delivery without the high fees of third-party platforms.
          </p>
          <Button
            onClick={onTakeoutDemo}
            className="w-full bg-[#E94E87] hover:bg-[#E94E87]/90 text-white"
          >
            Try Takeout Call Demo
            <Phone className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};