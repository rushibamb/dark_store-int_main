import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const warehouseZones = [
  { id: "A1", status: "active", category: "Electronics", fills: 92 },
  { id: "A2", status: "active", category: "Clothing", fills: 76 },
  { id: "A3", status: "active", category: "Home Goods", fills: 85 },
  { id: "A4", status: "active", category: "Toys", fills: 42 },
];

export function WarehouseMap() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getColorByCapacity = (capacity: number) => {
    if (capacity > 85) return "bg-green-500 text-white";
    if (capacity > 70) return "bg-green-400 text-white";
    if (capacity > 50) return "bg-green-300 text-green-800";
    if (capacity > 30) return "bg-amber-300 text-amber-800";
    return "bg-red-300 text-red-800";
  };

  return (
    <div className="animate-fade-up">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Warehouse Layout</CardTitle>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                High Utilization
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                Medium Utilization
              </Badge>
              <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                Low Utilization
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {warehouseZones.map((zone) => (
              <TooltipProvider key={zone.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative aspect-square rounded-md p-2 flex flex-col items-center justify-center shadow-sm border transition-all duration-200 cursor-pointer",
                        zone.status === "maintenance" ? "bg-gray-200 border-gray-300" : 
                        zone.status === "inactive" ? "bg-gray-100 border-gray-200" : 
                        getColorByCapacity(zone.fills),
                        selectedZone === zone.id ? "ring-2 ring-primary" : "",
                        "hover:scale-105"
                      )}
                      onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                    >
                      <span className="text-lg font-bold">{zone.id}</span>
                      <span className="text-xs opacity-80">{zone.category}</span>
                      
                      {zone.status === "maintenance" && (
                        <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center rounded-md">
                          <Badge variant="secondary" className="bg-white">Maintenance</Badge>
                        </div>
                      )}
                      
                      {zone.status === "inactive" && (
                        <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center rounded-md">
                          <Badge variant="secondary" className="bg-white">Inactive</Badge>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 text-xs">
                    <p className="font-medium">Zone {zone.id}</p>
                    <p>Category: {zone.category}</p>
                    <p>Status: {zone.status}</p>
                    <p>Utilization: {zone.fills}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}