import { Gift } from "lucide-react";

interface TipJarHeaderProps {
  serverName: string;
}

export const TipJarHeader = ({ serverName }: TipJarHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2">
        <Gift className="w-5 h-5 text-primary" />
        Appreciate {serverName}'s service?
      </h3>
      <p className="text-sm font-medium text-primary/90 animate-fade-in">
        Tip today, get 50% back as credit for your next visit! 🎁
      </p>
    </div>
  );
};