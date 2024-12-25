import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailHeaderProps {
  emailSubject: string;
  setEmailSubject: (value: string) => void;
}

export const EmailHeader = ({ emailSubject, setEmailSubject }: EmailHeaderProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="emailSubject">Email Subject</Label>
      <Input
        id="emailSubject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        placeholder="Enter email subject"
      />
    </div>
  );
};