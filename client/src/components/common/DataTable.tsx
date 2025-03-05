
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    title: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  onRowClick,
  className,
  emptyState
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: "asc" | "desc";
  } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle sort
  const handleSort = (key: keyof T | string) => {
    if (!columns.find(col => col.key === key)?.sortable) return;
    
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    
    setSortConfig({ key, direction });
  };
  
  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);
  
  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery || searchKeys.length === 0) return sortedData;
    
    return sortedData.filter(row => {
      return searchKeys.some(key => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        return String(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    });
  }, [sortedData, searchQuery, searchKeys]);
  
  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <Table className={cn("w-full", className)}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key.toString()}
                  className={cn({
                    "cursor-pointer hover:bg-muted/50": column.sortable,
                  })}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-muted-foreground">
                        {sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyState || (
                    <div className="text-muted-foreground">No results found</div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn({
                    "cursor-pointer hover:bg-muted/50": !!onRowClick,
                  })}
                >
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key.toString()}`}>
                      {column.render
                        ? column.render(
                            row[column.key as keyof T],
                            row
                          )
                        : row[column.key as keyof T] as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
