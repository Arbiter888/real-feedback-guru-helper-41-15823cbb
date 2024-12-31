import { Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TipJarHeaderProps {
  serverName: string;
}

export const TipJarHeader = ({ serverName }: TipJarHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-3"
    >
      <div className="flex items-center justify-center gap-2">
        <Gift className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold text-gray-900">
          Appreciate {serverName}'s service?
        </h3>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary/90">
        <Sparkles className="w-4 h-4" />
        <p className="animate-fade-in">
          Tip today, get 50% back as credit for your next visit!
        </p>
        <Sparkles className="w-4 h-4" />
      </div>
    </motion.div>
  );
};