import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AiPromptSectionProps {
  onGenerate: (subject: string, content: string) => void;
  disabled?: boolean;
}

export const AiPromptSection = ({ onGenerate, disabled }: AiPromptSectionProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = async () => {
    if (!prompt || !prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what kind of email you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-email', {
        body: { prompt },
      });

      if (response.error) throw new Error(response.error.message);
      
      const { subject, content } = response.data;
      onGenerate(subject, content);
      
      toast({
        title: "Email generated successfully",
        description: "Your AI-generated email is ready for review.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your email.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">AI Generation Prompt</Label>
      <div className="flex gap-2">
        <Input
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the email you want to generate..."
          className="flex-1"
          disabled={disabled}
        />
        <Button
          onClick={generateEmail}
          disabled={isGenerating || disabled || !prompt?.trim()}
          variant="secondary"
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