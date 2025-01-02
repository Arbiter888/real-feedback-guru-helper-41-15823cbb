import { Check, MessageSquare } from "lucide-react";

interface SuccessMessageProps {
  tipAmount?: number;
  referralCode: string;
  qrCodeUrl: string;
  firstName: string;
  restaurantName: string;
}

export const SuccessMessage = ({ 
  tipAmount, 
  referralCode,
  qrCodeUrl,
  firstName,
  restaurantName
}: SuccessMessageProps) => {
  const shareUrl = `${window.location.origin}/referral/${referralCode}`;
  const shareMessage = `Hey! Check out ${restaurantName}. Use my referral code to get a special welcome offer: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <Check className="h-8 w-8 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-900">
          Show this to your server
        </h3>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-gray-700">
            <Check className="w-5 h-5 text-green-500" />
            <span>Take 10% off your current bill</span>
          </li>
          {tipAmount && (
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-green-500" />
              <span>Add £{tipAmount.toFixed(2)} tip to the final amount</span>
            </li>
          )}
        </ul>
      </div>

      <p className="text-sm text-center text-gray-500">
        Valid for today only
      </p>

      <div className="pt-6 border-t border-gray-200 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Thanks {firstName}!</h3>
          <p className="text-gray-600">Share your personal restaurant recommendation</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <img src={qrCodeUrl} alt="Referral QR Code" className="w-48 h-48 mx-auto" />
        </div>

        <div className="space-y-4">
          <p className="font-medium text-center">When friends use your code, they'll get:</p>
          <ul className="text-gray-600 space-y-1 text-center">
            <li>• A special welcome voucher</li>
            <li>• Exclusive first-time visitor perks</li>
          </ul>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors mb-4"
          >
            <MessageSquare className="w-5 h-5" />
            Share on WhatsApp
          </a>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-500">Message Preview:</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareMessage);
                  toast({
                    title: "Copied to clipboard",
                    description: "The message has been copied to your clipboard.",
                  });
                }}
                className="text-primary hover:text-primary/90 text-sm font-medium"
              >
                Copy text
              </button>
            </div>
            <p className="text-sm text-gray-700">
              {`Hey! Just had amazing food at ${restaurantName}! You can get a welcome reward voucher when you sign up to their EatUP! rewards program using my referral link: ${shareUrl}. The food is fantastic!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};