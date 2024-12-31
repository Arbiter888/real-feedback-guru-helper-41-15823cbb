import { Card } from "@/components/ui/card";

interface RestaurantHeaderProps {
  name: string;
  isCustomDemo?: boolean;
}

export const RestaurantHeader = ({ name, isCustomDemo = false }: RestaurantHeaderProps) => {
  if (isCustomDemo) {
    return (
      <div className="flex flex-col items-center space-y-4 mb-8 md:mb-12">
        <img
          src="/lovable-uploads/9770ff21-86a3-477a-b98e-8264c81daf39.png"
          alt="Restaurant food spread"
          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
          Join {name}'s EatUP! Rewards
        </h1>
        <div className="text-muted-foreground text-center max-w-lg space-y-4">
          <p className="font-medium text-lg">Get rewarded twice:</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Earn instant credit back on your tips</li>
            <li>Receive special rewards for your reviews</li>
          </ol>
          <p className="text-sm italic">
            Plus unlock exclusive weekly offers when you join our mailing list!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 md:mb-12">
      <img
        src="/lovable-uploads/9770ff21-86a3-477a-b98e-8264c81daf39.png"
        alt="Restaurant food spread"
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full mx-auto md:mx-0"
      />
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary via-pink-500 to-secondary bg-clip-text text-transparent">
          Try EatUP! For Your Restaurant
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Turn Tips & Reviews into Customer Loyalty
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg">
          See how EatUP! helps you reward great service, collect reviews, and build your mailing list with our innovative dual-rewards system that keeps customers coming back.
        </p>
      </div>
    </div>
  );
};