import { PartyPopper, Star, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface TipRewardDisplayProps {
  selectedTip: number;
  rewardCode?: string | null;
  tipRewardPercentage?: number;
  reviewRewardAmount?: number;
}

export const TipRewardDisplay = ({ 
  selectedTip, 
  rewardCode,
  tipRewardPercentage = 50,
  reviewRewardAmount = 10
}: TipRewardDisplayProps) => {
  const rewardAmount = selectedTip * (tipRewardPercentage / 100);
  const totalRewardValue = rewardCode ? rewardAmount + reviewRewardAmount : rewardAmount;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card className="p-6 bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <PartyPopper className="w-6 h-6 text-primary animate-bounce" />
          <h3 className="text-2xl font-semibold text-gray-900">
            Total Rewards Value: £{totalRewardValue.toFixed(2)}
          </h3>
        </motion.div>
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
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Tip Reward Details</p>
                <p className="text-sm text-gray-600">
                  £{rewardAmount.toFixed(2)} credit from your £{selectedTip} tip
                </p>
                <motion.div 
                  className="pt-3 border-t border-pink-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
                  <p className="text-lg font-mono font-bold text-primary">TIP{selectedTip}BACK</p>
                </motion.div>
              </div>
            </motion.div>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Review Reward Details</p>
                <p className="text-sm text-gray-600">
                  Special reward for sharing your experience
                </p>
                {rewardCode && (
                  <motion.div 
                    className="pt-3 border-t border-pink-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
                    <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};