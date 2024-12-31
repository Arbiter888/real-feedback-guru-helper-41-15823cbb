import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuPreview } from "./MenuPreview";

interface DemoMenuSelectorProps {
  onMenuSelected: (menuVersion: any) => void;
}

export const DemoMenuSelector = ({ onMenuSelected }: DemoMenuSelectorProps) => {
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadDemoMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_menu_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading demo menus:', error);
      return [];
    }
  };

  const handlePreviewMenu = async (menu: any) => {
    setSelectedMenu(menu);
  };

  const handleSelectMenu = async (menu: any) => {
    setIsLoading(true);
    try {
      await onMenuSelected(menu);
      toast({
        title: "Demo menu selected",
        description: `${menu.analysis.cuisine} menu has been loaded successfully.`,
      });
    } catch (error) {
      console.error('Error selecting menu:', error);
      toast({
        title: "Error",
        description: "Failed to load demo menu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Or choose from our demo menus:</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Indian', 'Thai', 'Italian', 'American Diner', 'French'].map((cuisine) => (
          <div key={cuisine} className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleSelectMenu({ analysis: { cuisine } })}
              disabled={isLoading}
            >
              {cuisine} Menu
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreviewMenu({ analysis: { cuisine } })}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{cuisine} Menu Preview</DialogTitle>
                </DialogHeader>
                {selectedMenu && (
                  <MenuPreview
                    menuUrl={selectedMenu.menu_url}
                    analysis={selectedMenu.analysis}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};