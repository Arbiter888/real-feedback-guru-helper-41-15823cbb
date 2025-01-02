import { Star, Gift, MessageSquare } from "lucide-react";

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-12 px-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
          <Star className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Smart Tip Rewards</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Recognize and reward your servers while building customer loyalty through our innovative tip-based rewards system
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
          <Gift className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Dual Rewards System</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Double the engagement with rewards for both generous tipping and detailed reviews, creating a win-win for staff and customers
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="inline-block p-3 bg-[#E94E87]/10 rounded-full mb-3 md:mb-4">
          <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-[#E94E87]" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Automated Email Marketing</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Seamlessly collect customer emails and automate personalized marketing campaigns to keep them coming back
        </p>
      </div>
    </div>
  );
};