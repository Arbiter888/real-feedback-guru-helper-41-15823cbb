import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuVersionList } from "./MenuVersionList";
import { MenuPreview } from "./MenuPreview";

interface MenuUploadSectionProps {
  onMenuAnalyzed: (analysis: any) => void;
}

export const MenuUploadSection = ({ onMenuAnalyzed }: MenuUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersion, setCurrentVersion] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuVersions();
  }, []);

  const fetchMenuVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_menu_versions')
        .select('*')
        .order('version_number', { ascending: false });

      if (error) throw error;

      setVersions(data || []);
      const activeVersion = data?.find(v => v.is_active);
      if (activeVersion) {
        setCurrentVersion(activeVersion);
        onMenuAnalyzed(activeVersion.analysis);
      }
    } catch (error) {
      console.error('Error fetching menu versions:', error);
    }
  };

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

      // Create new menu version
      const newVersionNumber = versions.length > 0 
        ? Math.max(...versions.map(v => v.version_number)) + 1 
        : 1;

      const { data: versionData, error: versionError } = await supabase
        .from('restaurant_menu_versions')
        .insert({
          menu_url: publicUrl,
          version_number: newVersionNumber,
          analysis: analysisData.menuAnalysis,
          is_active: true,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update versions list and set current version
      await fetchMenuVersions();
      setCurrentVersion(versionData);
      onMenuAnalyzed(analysisData.menuAnalysis);
      
      toast({
        title: "Menu uploaded successfully",
        description: "Your menu has been analyzed and saved as a new version.",
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
      <div>
        <Label>Upload Menu</Label>
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

      {versions.length > 0 && (
        <>
          <MenuPreview 
            menuUrl={currentVersion?.menu_url} 
            analysis={currentVersion?.analysis} 
          />
          <MenuVersionList
            versions={versions}
            currentVersionId={currentVersion?.id}
            onVersionSelect={setCurrentVersion}
          />
        </>
      )}
    </div>
  );
};