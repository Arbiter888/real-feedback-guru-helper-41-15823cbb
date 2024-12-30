import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileType, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { DemoMenuSelector } from "../menu/DemoMenuSelector";

interface MenuUploadSectionProps {
  onMenuAnalyzed: (analysis: any) => void;
}

export const MenuUploadSection = ({ onMenuAnalyzed }: MenuUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleMenuUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('restaurant_menus')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('restaurant_menus')
        .getPublicUrl(filePath);

      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-menu', {
          body: { menuUrl: publicUrl },
        });

      if (analysisError) throw analysisError;

      onMenuAnalyzed(analysisData.menuAnalysis);
      
      toast({
        title: "Menu uploaded successfully",
        description: "Your menu has been analyzed and saved.",
      });
    } catch (error) {
      console.error('Menu upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your menu.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Label className="text-lg font-semibold mb-4 block">Upload Menu</Label>
        <div className="space-y-4">
          <Input
            id="menu-upload"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={handleMenuUpload}
            disabled={isUploading}
            className="hidden"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById('menu-upload')?.click()}
              disabled={isUploading}
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <Image className="h-8 w-8" />
              Choose Menu Image
              <span className="text-xs text-muted-foreground">
                Supports JPG, PNG
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('menu-upload')?.click()}
              disabled={isUploading}
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <FileType className="h-8 w-8" />
              Upload Document
              <span className="text-xs text-muted-foreground">
                Supports PDF, DOC
              </span>
            </Button>
          </div>

          {isUploading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Analyzing menu...</span>
            </div>
          )}
        </div>
      </Card>

      <DemoMenuSelector onMenuSelected={onMenuAnalyzed} />
    </div>
  );
};