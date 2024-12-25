import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export const EmailManagementSection = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { data: emailContacts, isLoading } = useQuery({
    queryKey: ["emailContacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleExport = async () => {
    if (!emailContacts?.length) {
      toast({
        title: "No emails to export",
        description: "Your email database is currently empty.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Convert data to CSV format
      const headers = ["Email", "First Name", "Last Name", "Created At"];
      const csvContent = [
        headers.join(","),
        ...emailContacts.map((contact) =>
          [
            contact.email,
            contact.first_name || "",
            contact.last_name || "",
            new Date(contact.created_at).toLocaleDateString(),
          ].join(",")
        ),
      ].join("\n");

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `email_database_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Your email database has been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your email database.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Email Database</h2>
        <Button
          onClick={handleExport}
          disabled={isExporting || !emailContacts?.length}
        >
          {isExporting ? "Exporting..." : "Export to CSV"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading email database...</div>
      ) : !emailContacts?.length ? (
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
              {emailContacts.map((contact) => (
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