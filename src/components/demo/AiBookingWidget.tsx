import { useEffect } from "react";

interface AiBookingWidgetProps {
  show: boolean;
}

export const AiBookingWidget = ({ show }: AiBookingWidgetProps) => {
  useEffect(() => {
    if (show) {
      const script = document.createElement('script');
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[9999] min-w-[320px]">
      <div className="relative">
        <elevenlabs-convai agent-id="jxfU4A9RgVhiHeuYqqHM"></elevenlabs-convai>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black rounded-full" />
      </div>
    </div>
  );
};