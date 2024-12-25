import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw, FileCode } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailContentInputProps {
  value: string;
  onChange: (value: string) => void;
  prompt: string;
  onGenerateHtml: (content: string) => void;
}

export const EmailContentInput = ({ 
  value, 
  onChange, 
  prompt,
  onGenerateHtml 
}: EmailContentInputProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false);
  const { toast } = useToast();

  const regenerateContent = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { 
          prompt: `Generate only plain text email content for: ${prompt}`,
          contentOnly: true 
        },
      });

      if (error) throw error;
      onChange(data.content);
      
      toast({
        title: "Content regenerated",
        description: "New email content has been generated.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate new content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHtml = async () => {
    if (!value) {
      toast({
        title: "Content required",
        description: "Please enter or generate content first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingHtml(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { 
          prompt: `Convert this plain text email to responsive HTML with proper styling: ${value}`,
          htmlOnly: true 
        },
      });

      if (error) throw error;
      onGenerateHtml(data.content);
      
      toast({
        title: "HTML generated",
        description: "Email content has been converted to HTML.",
      });
    } catch (error) {
      console.error('HTML generation error:', error);
      toast({
        title: "HTML generation failed",
        description: "Failed to convert content to HTML.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingHtml(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="emailContent">Email Content (Plain Text)</Label>
      <div className="space-y-2">
        <Textarea
          id="emailContent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your email content"
          className="min-h-[200px] font-mono"
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={regenerateContent}
            disabled={isGenerating}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate Content
          </Button>
          <Button 
            variant="outline" 
            onClick={generateHtml}
            disabled={isGeneratingHtml}
            className="flex-1"
          >
            <FileCode className="h-4 w-4 mr-2" />
            Generate HTML
          </Button>
        </div>
      </div>
    </div>
  );
};