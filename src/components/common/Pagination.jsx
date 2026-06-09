import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/helpers";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    // Simple page generator
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all border",
            currentPage === i
              ? "bg-primary border-primary text-bg-dark shadow-[0_0_12px_rgba(0,200,150,0.3)]"
              : "bg-white/5 border-white/10 dark:border-white/10 text-text-secondary-dark hover:text-white hover:bg-white/10"
          )}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between py-4 border-t border-white/5 dark:border-white/5 mt-4", className)}>
      <div className="text-xs text-text-secondary-dark font-medium">
        Page <span className="text-white light:text-bg-dark">{currentPage}</span> of <span className="text-white light:text-bg-dark">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center border bg-white/5 border-white/10 dark:border-white/10 text-text-secondary-dark hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center border bg-white/5 border-white/10 dark:border-white/10 text-text-secondary-dark hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
