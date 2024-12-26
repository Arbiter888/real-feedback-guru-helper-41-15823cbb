import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, MessageSquare, Receipt, Bot } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface EmailContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  metadata?: {
    initial_review?: string;
    refined_review?: string;
    receipt_analysis?: {
      total_amount: number;
      items: Array<{ name: string; price: number }>;
    };
    server_name?: string;
    reward_code?: string;
    google_maps_url?: string;
    restaurant_name?: string;
    submission_date?: string;
  };
}

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
                        {/* Initial Thoughts */}
                        {contact.metadata.initial_review && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">Initial Thoughts</h4>
                            </div>
                            <p className="text-sm text-gray-700">{contact.metadata.initial_review}</p>
                          </div>
                        )}

                        {/* Receipt Analysis */}
                        {contact.metadata.receipt_analysis && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Receipt className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">Receipt Analysis</h4>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                              <p className="font-medium mb-2">
                                Total Amount: {formatCurrency(contact.metadata.receipt_analysis.total_amount)}
                              </p>
                              <div className="space-y-1">
                                {contact.metadata.receipt_analysis.items.map((item, index) => (
                                  <div key={index} className="text-sm flex justify-between">
                                    <span>{item.name}</span>
                                    <span>{formatCurrency(item.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Enhanced Review */}
                        {contact.metadata.refined_review && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">Enhanced Review</h4>
                            </div>
                            <p className="text-sm text-gray-700">{contact.metadata.refined_review}</p>
                          </div>
                        )}

                        {/* Additional Metadata */}
                        <div className="text-sm text-gray-600 mt-4 pt-4 border-t">
                          {contact.metadata.server_name && (
                            <p>Server: {contact.metadata.server_name}</p>
                          )}
                          {contact.metadata.restaurant_name && (
                            <p>Restaurant: {contact.metadata.restaurant_name}</p>
                          )}
                          {contact.metadata.reward_code && (
                            <p>Reward Code: {contact.metadata.reward_code}</p>
                          )}
                        </div>
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