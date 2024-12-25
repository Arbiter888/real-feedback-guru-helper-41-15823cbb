import { Label } from "@/components/ui/label";

interface EmailContentProps {
  emailContent: string;
  setEmailContent: (value: string) => void;
}

export const EmailContent = ({ emailContent, setEmailContent }: EmailContentProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="emailContent">Email Content</Label>
      <textarea
        id="emailContent"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Enter your email content"
        className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};