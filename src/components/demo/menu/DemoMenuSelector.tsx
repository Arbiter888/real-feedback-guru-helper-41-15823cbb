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

const DEMO_MENUS = [
  { cuisine: 'Indian', emoji: '🇮🇳', color: 'bg-orange-100 hover:bg-orange-200' },
  { cuisine: 'Thai', emoji: '🇹🇭', color: 'bg-red-100 hover:bg-red-200' },
  { cuisine: 'Italian', emoji: '🇮🇹', color: 'bg-green-100 hover:bg-green-200' },
  { cuisine: 'American Diner', emoji: '🍔', color: 'bg-blue-100 hover:bg-blue-200' },
  { cuisine: 'French', emoji: '🇫🇷', color: 'bg-purple-100 hover:bg-purple-200' },
];

interface DemoMenuSelectorProps {
  onMenuSelected: (menuVersion: any) => void;
  activeMenuId?: string;
}

export const DemoMenuSelector = ({ onMenuSelected, activeMenuId }: DemoMenuSelectorProps) => {
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadDemoMenu = async (cuisine: string) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_menu_versions')
        .select('*')
        .eq('metadata->cuisine', cuisine)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading demo menu:', error);
      return null;
    }
  };

  const handlePreviewMenu = async (cuisine: string) => {
    const menu = await loadDemoMenu(cuisine);
    setSelectedMenu(menu);
  };

  const handleSelectMenu = async (cuisine: string) => {
    setIsLoading(true);
    try {
      const menu = await loadDemoMenu(cuisine);
      if (menu) {
        await onMenuSelected(menu);
        toast({
          title: "Demo menu selected",
          description: `${cuisine} menu has been loaded successfully.`,
        });
      }
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
        {DEMO_MENUS.map(({ cuisine, emoji, color }) => (
          <div key={cuisine} className="flex gap-2">
            <Button
              variant="outline"
              className={`flex-1 ${color} ${activeMenuId === cuisine ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleSelectMenu(cuisine)}
              disabled={isLoading}
            >
              <span className="mr-2">{emoji}</span>
              {cuisine} Menu
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreviewMenu(cuisine)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    <span className="mr-2">{emoji}</span>
                    {cuisine} Menu Preview
                  </DialogTitle>
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