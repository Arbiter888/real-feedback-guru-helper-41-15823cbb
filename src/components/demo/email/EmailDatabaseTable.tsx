import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmailContact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

interface EmailDatabaseTableProps {
  contacts: EmailContact[];
  onExport: () => void;
  isExporting: boolean;
}

export const EmailDatabaseTable = ({ contacts, onExport, isExporting }: EmailDatabaseTableProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Email Database</h2>
        <Button onClick={onExport} disabled={isExporting || !contacts?.length}>
          {isExporting ? "Exporting..." : "Export to CSV"}
        </Button>
      </div>

      {!contacts?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          No emails in database yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.first_name || "-"}</TableCell>
                  <TableCell>{contact.last_name || "-"}</TableCell>
                  <TableCell>
                    {new Date(contact.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};