import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRound } from "lucide-react";

interface ServerSelectionStepProps {
  onServerSelect: (serverName: string) => void;
}

export const ServerSelectionStep = ({ onServerSelect }: ServerSelectionStepProps) => {
  const [serverNames, setServerNames] = useState<string[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  useEffect(() => {
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const { serverNames: savedServerNames } = JSON.parse(savedRestaurantInfo);
      if (Array.isArray(savedServerNames)) {
        setServerNames(savedServerNames);
      }
    }
  }, []);

  const handleServerSelect = (name: string) => {
    setSelectedServer(name);
    onServerSelect(name);
  };

  if (!serverNames.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
        <UserRound className="h-5 w-5" />
        <h3>Who served you today?</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {serverNames.map((name) => (
          <Button
            key={name}
            variant={selectedServer === name ? "default" : "outline"}
            onClick={() => handleServerSelect(name)}
            className="flex-grow sm:flex-grow-0"
          >
            {name}
          </Button>
        ))}
      </div>
      <Select onValueChange={handleServerSelect} value={selectedServer || undefined}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Or select your server" />
        </SelectTrigger>
        <SelectContent>
          {serverNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};