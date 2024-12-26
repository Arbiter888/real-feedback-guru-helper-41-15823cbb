import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EmailContact, isReviewMetadata } from "@/types/email";
import { MetadataDisplay } from "./table/MetadataDisplay";

interface EmailDatabaseTableProps {
  contacts: EmailContact[];
  onExport: () => void;
  isExporting: boolean;
}

export const EmailDatabaseTable = ({ contacts, onExport, isExporting }: EmailDatabaseTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Database</h2>
        <Button onClick={onExport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export to CSV"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <>
                <TableRow key={contact.id}>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.first_name || "-"}</TableCell>
                  <TableCell>{contact.last_name || "-"}</TableCell>
                  <TableCell>
                    {new Date(contact.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(contact.id)}
                    >
                      {expandedRows.has(contact.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {expandedRows.has(contact.id) ? "Hide Details" : "Show Details"}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(contact.id) && contact.metadata && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Card className="p-4 space-y-4 bg-slate-50">
                        {isReviewMetadata(contact.metadata) && (
                          <MetadataDisplay 
                            metadata={contact.metadata} 
                            formatCurrency={formatCurrency}
                          />
                        )}
                      </Card>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contacts in the database yet
        </div>
      )}
    </div>
  );
};