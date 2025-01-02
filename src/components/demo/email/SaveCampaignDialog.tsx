import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaveCampaignDialogProps {
  listId: string;
  emailSubject: string;
  emailContent: string;
}

export const SaveCampaignDialog = ({ listId, emailSubject, emailContent }: SaveCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveCampaignMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('saved_campaigns')
        .insert([
          {
            title,
            subject: emailSubject,
            content: emailContent,
            list_id: listId,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Campaign saved",
        description: "Your campaign has been saved as a draft.",
      });
      setOpen(false);
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ['saved-campaigns'] });
    },
    onError: (error) => {
      toast({
        title: "Error saving campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Campaign</DialogTitle>
          <DialogDescription>
            Give your campaign a title to save it as a draft
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Newsletter - June 2024"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => saveCampaignMutation.mutate()}
            disabled={!title.trim() || saveCampaignMutation.isPending}
          >
            Save Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};