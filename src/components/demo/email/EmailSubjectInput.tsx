import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailSubjectInputProps {
  value: string;
  onChange: (value: string) => void;
  prompt: string;
}

export const EmailSubjectInput = ({ value, onChange, prompt }: EmailSubjectInputProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const regenerateSubject = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate a subject line.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { 
          prompt: `Generate only an email subject line for: ${prompt}`,
          subjectOnly: true 
        },
      });

      if (error) throw error;
      onChange(data.subject);
      
      toast({
        title: "Subject regenerated",
        description: "New subject line has been generated.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate new subject line.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="emailSubject">Email Subject</Label>
      <div className="flex gap-2">
        <Input
          id="emailSubject"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter email subject"
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={regenerateSubject}
          disabled={isGenerating}
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};