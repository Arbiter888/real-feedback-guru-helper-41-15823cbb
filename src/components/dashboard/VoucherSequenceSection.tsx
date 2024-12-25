import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface VoucherSequence {
  id?: string;
  name: string;
  description: string;
  target_sentiment: string;
  sequence_order: number[];
}

export const VoucherSequenceSection = () => {
  const [sequences, setSequences] = useState<VoucherSequence[]>([]);
  const [newSequence, setNewSequence] = useState<VoucherSequence>({
    name: "",
    description: "",
    target_sentiment: "positive",
    sequence_order: []
  });
  const { toast } = useToast();

  const handleCreateSequence = async () => {
    try {
      const { data, error } = await supabase
        .from('voucher_sequences')
        .insert([newSequence])
        .select();

      if (error) throw error;

      setSequences([...sequences, data[0]]);
      setNewSequence({
        name: "",
        description: "",
        target_sentiment: "positive",
        sequence_order: []
      });

      toast({
        title: "Sequence created",
        description: "Your voucher sequence has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to create voucher sequence.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Voucher Sequences</h2>
      
      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-4">Create New Sequence</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Sequence Name</Label>
            <Input
              id="name"
              value={newSequence.name}
              onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter sequence name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newSequence.description}
              onChange={(e) => setNewSequence(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this sequence"
            />
          </div>

          <div>
            <Label htmlFor="sentiment">Target Sentiment</Label>
            <select
              id="sentiment"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={newSequence.target_sentiment}
              onChange={(e) => setNewSequence(prev => ({ ...prev, target_sentiment: e.target.value }))}
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <Button onClick={handleCreateSequence} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Sequence
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {sequences.map((sequence) => (
          <Card key={sequence.id} className="p-4">
            <h3 className="font-medium">{sequence.name}</h3>
            <p className="text-sm text-gray-500">{sequence.description}</p>
            <p className="text-sm mt-2">
              Target Sentiment: <span className="font-medium">{sequence.target_sentiment}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};