import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      // Upload menu image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('restaurant_menus')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('restaurant_menus')
        .getPublicUrl(filePath);

      // Analyze menu using edge function
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
    <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
      <div>
        <Label htmlFor="menu-upload">Upload Menu</Label>
        <div className="mt-2">
          <Input
            id="menu-upload"
            type="file"
            accept="image/*"
            onChange={handleMenuUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('menu-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Menu...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose Menu Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};