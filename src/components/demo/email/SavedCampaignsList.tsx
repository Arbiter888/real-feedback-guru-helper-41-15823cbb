import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SavedCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
  scheduled_for: string | null;
}

interface SavedCampaignsListProps {
  onLoadCampaign: (campaign: SavedCampaign) => void;
  listId: string;
}

export const SavedCampaignsList = ({ onLoadCampaign, listId }: SavedCampaignsListProps) => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['saved-campaigns', listId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_campaigns')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SavedCampaign[];
    },
  });

  const getStatusColor = (status: SavedCampaign['status']) => {
    switch (status) {
      case 'draft': return 'text-yellow-600';
      case 'scheduled': return 'text-blue-600';
      case 'sent': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading saved campaigns...</div>;
  }

  if (!campaigns?.length) {
    return <div className="text-center py-4 text-gray-500">No saved campaigns yet</div>;
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">{campaign.title}</h3>
              <p className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(campaign.created_at))} ago
              </p>
              <p className={`text-sm font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadCampaign(campaign)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};