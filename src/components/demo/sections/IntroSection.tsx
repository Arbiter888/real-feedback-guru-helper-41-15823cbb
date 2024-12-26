import React from "react";

export const IntroSection = () => {
  return (
    <div className="text-center">
      <div className="space-y-2">
        <p className="text-lg font-medium text-primary">
          Get Your Personalized Rewards! 🎁
        </p>
        <div className="text-gray-600">
          <p>Join our smart loyalty program in 3 simple steps:</p>
          <p>1. Share your dining experience below</p>
          <p>2. Add your receipt for personalized rewards</p>
          <p>3. Get instant rewards + join our weekly offers list</p>
          <p className="text-primary mt-2">
            Plus, unlock better rewards with each visit!
          </p>
        </div>
      </div>
    </div>
  );
};