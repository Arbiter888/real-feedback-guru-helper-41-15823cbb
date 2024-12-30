import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  remainingCount: number;
  isLoading: boolean;
  onClick: () => void;
}

export const LoadMoreButton = ({
  remainingCount,
  isLoading,
  onClick,
}: LoadMoreButtonProps) => {
  if (remainingCount === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="w-full max-w-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          `Load More (${remainingCount} remaining)`
        )}
      </Button>
    </div>
  );
};