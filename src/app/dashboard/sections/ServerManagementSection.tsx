import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface ServerManagementSectionProps {
  serverNames: string[];
  onServerNamesChange: (names: string[]) => void;
}

export const ServerManagementSection = ({
  serverNames,
  onServerNamesChange,
}: ServerManagementSectionProps) => {
  const [newServerName, setNewServerName] = useState("");

  const handleAddServer = () => {
    if (!newServerName.trim()) return;
    onServerNamesChange([...serverNames, newServerName.trim()]);
    setNewServerName("");
  };

  const handleRemoveServer = (indexToRemove: number) => {
    onServerNamesChange(serverNames.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <Label>Server Names</Label>
      <div className="flex gap-2">
        <Input
          value={newServerName}
          onChange={(e) => setNewServerName(e.target.value)}
          placeholder="Add server name"
          onKeyPress={(e) => e.key === 'Enter' && handleAddServer()}
        />
        <Button 
          type="button" 
          onClick={handleAddServer}
          variant="outline"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {serverNames.map((name, index) => (
          <div 
            key={index}
            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            <span>{name}</span>
            <button
              onClick={() => handleRemoveServer(index)}
              className="hover:text-primary/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};