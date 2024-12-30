import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchMenuVersions();
  }, []);

  const fetchMenuVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_menu_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
      
      // Set the active version if exists
      const activeVersion = data?.find(v => v.is_active);
      if (activeVersion) {
        setCurrentVersion(activeVersion);
      }
    } catch (error) {
      console.error('Error fetching menu versions:', error);
    }
  };

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
          },
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Deactivate other versions
      if (currentVersion) {
        await supabase
          .from('restaurant_menu_versions')
          .update({ is_active: false })
          .eq('id', currentVersion.id);
      }

      await fetchMenuVersions();
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
    <Card className="p-6 space-y-8 bg-gradient-to-b from-white to-pink-50">
      <h2 className="text-2xl font-semibold text-gray-900">Menu Management</h2>
      
      {currentVersion && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
          <h3 className="text-lg font-medium mb-4">Current Active Menu</h3>
          <MenuPreview 
            menuUrl={currentVersion.menu_url} 
            analysis={currentVersion.analysis} 
          />
        </div>
      )}

      <MenuUploadSection onMenuAnalyzed={handleMenuAnalyzed} />
      
      <DemoMenuSelector 
        onMenuSelected={handleMenuAnalyzed}
        activeMenuId={currentVersion?.metadata?.cuisine}
      />

      {versions.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
          <h3 className="text-lg font-medium mb-4">Menu Version History</h3>
          <MenuVersionList
            versions={versions}
            currentVersionId={currentVersion?.id}
            onVersionSelect={async (version) => {
              // Update active status
              await supabase
                .from('restaurant_menu_versions')
                .update({ is_active: true })
                .eq('id', version.id);
              
              if (currentVersion) {
                await supabase
                  .from('restaurant_menu_versions')
                  .update({ is_active: false })
                  .eq('id', currentVersion.id);
              }
              
              await fetchMenuVersions();
              setCurrentVersion(version);
            }}
          />
        </div>
      )}
    </Card>
  );
};