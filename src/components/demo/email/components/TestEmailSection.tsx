import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestTube2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestEmailSectionProps {
  emailSubject: string;
  emailContent: string;
  restaurantInfo: any;
  disabled?: boolean;
}

export const TestEmailSection = ({ emailSubject, emailContent, restaurantInfo, disabled }: TestEmailSectionProps) => {
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();

  const handleSendTest = async () => {
    if (!testEmail || !emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide test email address, subject, and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      const response = await supabase.functions.invoke("send-test-email", {
        body: {
          to: testEmail,
          subject: emailSubject,
          htmlContent: emailContent,
          restaurantInfo,
        },
      });

      if (response.error) throw new Error(response.error.message);

      toast({
        title: "Test email sent",
        description: `Test email sent to ${testEmail}`,
      });
    } catch (error) {
      console.error('Test email error:', error);
      toast({
        title: "Failed to send test email",
        description: "There was an error sending the test email.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="flex gap-2 items-center flex-1">
      <Input
        type="email"
        placeholder="Test email address"
        value={testEmail}
        onChange={(e) => setTestEmail(e.target.value)}
      />
      <Button
        variant="outline"
        onClick={handleSendTest}
        disabled={isSendingTest || !testEmail || !emailContent.trim() || !emailSubject.trim() || disabled}
      >
        {isSendingTest ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <TestTube2 className="mr-2 h-4 w-4" />
            Test
          </>
        )}
      </Button>
    </div>
  );
};