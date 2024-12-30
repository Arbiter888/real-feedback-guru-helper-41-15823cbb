import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Check, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface MenuVersion {
  id: string;
  version_number: number;
  menu_url: string;
  created_at: string;
  is_active: boolean;
}

interface MenuVersionListProps {
  versions: MenuVersion[];
  onVersionSelect: (version: MenuVersion) => void;
  currentVersionId?: string;
}

export const MenuVersionList = ({ versions, onVersionSelect, currentVersionId }: MenuVersionListProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleVersionSelect = async (version: MenuVersion) => {
    if (version.id === currentVersionId) return;
    
    setIsLoading(version.id);
    try {
      // Update active status
      const { error } = await supabase
        .from('restaurant_menu_versions')
        .update({ is_active: true })
        .eq('id', version.id);

      if (error) throw error;
      onVersionSelect(version);
    } catch (error) {
      console.error('Error selecting version:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <History className="h-5 w-5" />
        Menu Versions
      </h3>
      <div className="grid gap-3">
        {versions.map((version) => (
          <Card
            key={version.id}
            className={`p-4 cursor-pointer transition-colors ${
              version.id === currentVersionId
                ? 'bg-primary/5 border-primary/20'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleVersionSelect(version)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Version {version.version_number}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                </p>
              </div>
              {version.id === currentVersionId && (
                <Check className="h-5 w-5 text-primary" />
              )}
              {isLoading === version.id && (
                <Clock className="h-5 w-5 text-gray-400 animate-spin" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};