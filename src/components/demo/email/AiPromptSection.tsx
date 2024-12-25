import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AiPromptSectionProps {
  onEmailGenerated: (subject: string, content: string) => void;
}

export const AiPromptSection = ({ onEmailGenerated }: AiPromptSectionProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateEmail = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate the email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { prompt },
      });

      if (error) throw error;

      onEmailGenerated(data.subject || '', data.content || '');
      
      toast({
        title: "Email generated",
        description: "Your email has been generated based on the prompt.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate email content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="prompt">AI Generation Prompt</Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the email you want to generate..."
          />
        </div>
        <Button
          onClick={handleGenerateEmail}
          disabled={isGenerating || !prompt}
          className="mt-6"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};