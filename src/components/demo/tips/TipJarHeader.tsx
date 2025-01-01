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
      className="text-center space-y-4"
    >
      <div className="flex items-center justify-center gap-2">
        <Gift className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">
          Add a tip for {serverName}?
        </h2>
      </div>
      <div className="flex items-center justify-center gap-2 text-lg font-medium text-primary/90">
        <Sparkles className="w-5 h-5" />
        <p className="animate-fade-in">
          Get 50% back as credit for your next visit!
        </p>
        <Sparkles className="w-5 h-5" />
      </div>
    </motion.div>
  );
};