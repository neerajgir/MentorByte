"use client";

import { Button } from "@/components/ui/button";

/**
 * Pagination controls with previous/next buttons and page info
 */
export function ProblemsPagination({
  currentPage,
  totalPages,
  displayRange,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}:any) {
  return (
    <div className="flex items-center justify-between">
      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {displayRange.start} to {displayRange.end} of{" "}
        {displayRange.total} problems
      </p>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrevious}
          onClick={onPrevious}
        >
          Previous
        </Button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}