import React from "react";
import { cn } from "../../utils/helpers";
import EmptyState from "./EmptyState";

const Table = ({
  columns = [], // Array of { key, header, className, render }
  data = [],
  renderMobileCard, // Function (item, index) => ReactNode for mobile card view
  loading = false,
  emptyMessage = "No items found",
  emptyIcon,
  className = ""
}) => {
  if (data.length === 0 && !loading) {
    return (
      <EmptyState
        message={emptyMessage}
        icon={emptyIcon}
        className="py-12 border border-white/5 bg-card-dark/20 rounded-xl"
      />
    );
  }

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {/* Desktop View Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 dark:border-white/10 bg-card-dark/30 light:bg-card-light/50">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={cn(
                    "py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 dark:divide-white/5">
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-white/2 bg-transparent transition-colors group"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={cn(
                      "py-4 px-6 text-sm text-white dark:text-white light:text-text-primary-light font-medium",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Render Cards */}
      <div className="block md:hidden flex flex-col gap-4">
        {data.map((item, idx) => (
          <div key={item.id || idx}>
            {renderMobileCard ? (
              renderMobileCard(item, idx)
            ) : (
              <div className="glass-panel border border-white/15 dark:border-white/10 rounded-xl p-4 flex flex-col gap-2">
                {columns.map((col, colIdx) => (
                  <div key={col.key || colIdx} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-text-secondary-dark font-semibold font-display text-xs uppercase tracking-wider">{col.header}</span>
                    <span className="text-white light:text-bg-dark font-medium">
                      {col.render ? col.render(item, idx) : item[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
