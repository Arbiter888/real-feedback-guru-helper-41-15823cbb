import { PartyPopper, Star, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface TipRewardDisplayProps {
  selectedTip: number;
  rewardCode?: string | null;
}

export const TipRewardDisplay = ({ selectedTip, rewardCode }: TipRewardDisplayProps) => {
  const rewardAmount = selectedTip * 0.5;
  const totalRewardValue = rewardCode ? rewardAmount + 10 : rewardAmount; // Assuming review reward is £10
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PartyPopper className="w-6 h-6 text-primary animate-bounce" />
          <h3 className="text-2xl font-semibold text-gray-900">
            Total Rewards Value: £{totalRewardValue.toFixed(2)}
          </h3>
        </div>
      </Card>

      <Tabs defaultValue="tip" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tip" className="data-[state=active]:bg-primary/10">
            <Star className="w-4 h-4 mr-2" />
            Tip Reward
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-primary/10">
            <Gift className="w-4 h-4 mr-2" />
            Review Reward
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tip">
          <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Tip Reward Details</p>
                <p className="text-sm text-gray-600">
                  £{rewardAmount.toFixed(2)} credit from your £{selectedTip} tip
                </p>
                <div className="pt-3 border-t border-pink-100">
                  <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
                  <p className="text-lg font-mono font-bold text-primary">TIP{selectedTip}BACK</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Review Reward Details</p>
                <p className="text-sm text-gray-600">
                  Special reward for sharing your experience
                </p>
                {rewardCode && (
                  <div className="pt-3 border-t border-pink-100">
                    <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
                    <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};