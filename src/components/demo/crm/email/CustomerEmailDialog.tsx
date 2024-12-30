import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Customer } from "@/types/customer";

interface CustomerEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmailData: any;
  onSendEmail: (customer: Customer, emailData: any) => void;
  customer: Customer | null;
  sendingEmailFor: string | null;
}

export const CustomerEmailDialog = ({
  isOpen,
  onOpenChange,
  selectedEmailData,
  onSendEmail,
  customer,
  sendingEmailFor,
}: CustomerEmailDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Thank You Email</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to send this email to {selectedEmailData?.email}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (customer) {
                onSendEmail(customer, selectedEmailData);
              }
            }}
            disabled={sendingEmailFor !== null}
          >
            {sendingEmailFor !== null ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};