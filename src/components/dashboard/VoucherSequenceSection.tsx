import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface VoucherSequence {
  id?: string;
  name: string;
  description: string;
  target_sentiment: string;
  sequence_order: number[];
  restaurant_id?: string;
}

export const VoucherSequenceSection = () => {
  const { user } = useAuth();
  const [sequences, setSequences] = useState<VoucherSequence[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [newSequence, setNewSequence] = useState<VoucherSequence>({
    name: "",
    description: "",
    target_sentiment: "positive",
    sequence_order: []
  });
  const { toast } = useToast();

  // Fetch the restaurant ID for the current user
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Error",
          description: "Failed to fetch restaurant information.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setRestaurantId(data.id);
        // Fetch sequences for this restaurant
        fetchSequences(data.id);
      }
    };

    fetchRestaurantId();
  }, [user]);

  const fetchSequences = async (restId: string) => {
    const { data, error } = await supabase
      .from('voucher_sequences')
      .select('*')
      .eq('restaurant_id', restId);

    if (error) {
      console.error('Error fetching sequences:', error);
      return;
    }

    setSequences(data || []);
  };

  const handleCreateSequence = async () => {
    if (!restaurantId) {
      toast({
        title: "Error",
        description: "No restaurant found. Please set up your restaurant first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sequenceWithRestaurant = {
        ...newSequence,
        restaurant_id: restaurantId
      };

      const { data, error } = await supabase
        .from('voucher_sequences')
        .insert([sequenceWithRestaurant])
        .select();

      if (error) throw error;

      if (data) {
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
      }
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to create voucher sequence.",
        variant: "destructive",
      });
    }
  };

  if (!user || !restaurantId) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Voucher Sequences</h2>
        <p className="text-gray-500">Please set up your restaurant first to manage voucher sequences.</p>
      </div>
    );
  }

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