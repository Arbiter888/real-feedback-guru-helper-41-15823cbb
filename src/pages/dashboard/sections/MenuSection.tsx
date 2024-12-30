import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MenuUploadSection } from "@/components/demo/restaurant/MenuUploadSection";
import { MenuVersionList } from "@/components/demo/menu/MenuVersionList";
import { MenuPreview } from "@/components/demo/menu/MenuPreview";
import { DemoMenuSelector } from "@/components/demo/menu/DemoMenuSelector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MenuSectionProps {
  restaurantInfo: {
    restaurantName: string;
    menuAnalysis?: any;
  };
}

export const MenuSection = ({ restaurantInfo }: MenuSectionProps) => {
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersion, setCurrentVersion] = useState<any>(null);
  const { toast } = useToast();

  const handleMenuAnalyzed = async (analysis: any) => {
    try {
      const { data: menuVersion, error } = await supabase
        .from('restaurant_menu_versions')
        .insert({
          version_number: versions.length + 1,
          menu_url: '',  // Will be updated after upload
          analysis: analysis,
          metadata: {
            restaurant_name: restaurantInfo.restaurantName
          }
        })
        .select()
        .single();

      if (error) throw error;

      setVersions(prev => [...prev, menuVersion]);
      setCurrentVersion(menuVersion);

      toast({
        title: "Menu analyzed successfully",
        description: "Your menu has been processed and saved.",
      });
    } catch (error) {
      console.error('Error saving menu version:', error);
      toast({
        title: "Error",
        description: "Failed to save menu version.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-8">
      <h2 className="text-xl font-semibold">Menu Management</h2>
      
      {currentVersion && (
        <MenuPreview 
          menuUrl={currentVersion.menu_url} 
          analysis={currentVersion.analysis} 
        />
      )}

      <MenuUploadSection onMenuAnalyzed={handleMenuAnalyzed} />
      
      <DemoMenuSelector onMenuSelected={handleMenuAnalyzed} />

      {versions.length > 0 && (
        <MenuVersionList
          versions={versions}
          currentVersionId={currentVersion?.id}
          onVersionSelect={setCurrentVersion}
        />
      )}
    </Card>
  );
};