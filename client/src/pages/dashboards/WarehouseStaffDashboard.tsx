import { useState, useEffect } from "react";
import Orders from "@/components/Orders/Orders"; // Import the Orders component
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import Stats from "@/components/common/Stats";
import Inventory from "@/components/Inventory/Inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Package, 
  Clock, 
  Scan, 
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { WarehouseMap } from "@/components/WareHouseMap/Warehousemap"; // Import the WarehouseMap component
import { useInventory } from "@/contexts/InventoryContext"; // Correct the import path

export interface Order {
  id: string;
  retailer: string;
  status: "Pending" | "Picked" | "Packing" | "Completed";
  products: {
    id: number;
    name: string;
    quantity: number;
    picked: boolean;
  }[];
  progress: number;
  category: string; // Add category field
}

const WarehouseStaffDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { orders: assignedOrders, setOrders: setAssignedOrders } = useInventory();
  const [barcodeScan, setBarcodeScan] = useState("");
  const [completedToday, setCompletedToday] = useState<number>(0);
  const [totalItemsPicked, setTotalItemsPicked] = useState<number>(0);

  // Calculate completed orders and items picked whenever assignedOrders changes
  useEffect(() => {
    const completedCount = assignedOrders.filter(order => order.status === "Completed").length;
    setCompletedToday(completedCount);

    const itemsPickedCount = assignedOrders.reduce((total, order) => {
      return total + order.products.filter(product => product.picked).length;
    }, 0);
    setTotalItemsPicked(itemsPickedCount);
  }, [assignedOrders]);

  const updateAssignedOrders = (newOrders: Order[]) => {
    setAssignedOrders(newOrders);
  };

  // Handle status change for orders
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = assignedOrders.map(order => {
      if (order.id === orderId) {
        if (order.status === "Completed") {
          toast({
            title: "Action not allowed",
            description: "Completed orders cannot be changed",
            variant: "destructive",
          });
          return order;
        }

        // If status is changed to "Picked", mark all products as picked
        if (newStatus === "Picked") {
          return {
            ...order,
            status: newStatus,
            products: order.products.map(product => ({ ...product, picked: true })),
          };
        }

        return { ...order, status: newStatus };
      }
      return order;
    });

    updateAssignedOrders(updatedOrders);
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  // Barcode scanning logic
  const handleScanItem = () => {
    if (!barcodeScan.trim()) {
      toast({
        title: "Empty scan",
        description: "Please scan or enter a product barcode",
        variant: "destructive",
      });
      return;
    }

    // Mock scan handling
    const updatedOrders = [...assignedOrders];
    let found = false;

    for (let i = 0; i < updatedOrders.length; i++) {
      const order = updatedOrders[i];
      if (order.status === "Completed") {
        toast({
          title: "Action not allowed",
          description: "Completed orders cannot be changed",
          variant: "destructive",
        });
        continue;
      }
      if (order.status !== "Picked") continue;

      for (let j = 0; j < order.products.length; j++) {
        const product = order.products[j];
        if (!product.picked && product.name.toLowerCase().includes(barcodeScan.toLowerCase())) {
          order.products[j] = { ...product, picked: true };
          found = true;

          // Calculate new progress
          const pickedCount = order.products.filter(p => p.picked).length;
          order.progress = Math.round((pickedCount / order.products.length) * 100);

          toast({
            title: "Item scanned successfully",
            description: `${product.name} added to order ${order.id}`,
          });

          // Check if all items for this order are picked
          if (order.progress === 100) {
            order.status = "Packing";
            toast({
              title: "Order picking complete",
              description: `Order ${order.id} is ready for packing`,
            });
          }

          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      toast({
        title: "Product not found",
        description: "This product isn't in your current picking list",
        variant: "destructive",
      });
    }

    updateAssignedOrders(updatedOrders);
    setBarcodeScan("");
  };

  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Warehouse Staff Dashboard</h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          {user?.name ? `Welcome, ${user.name}` : "Warehouse Operations"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Stats 
            title="Assigned Orders" 
            value={assignedOrders.length.toString()} 
            description="Awaiting completion" 
            icon={<Clock className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Completed Today" 
            value={completedToday.toString()} 
            description="Orders fulfilled" 
            icon={<CheckCircle2 className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Items Picked" 
            value={totalItemsPicked.toString()} 
            description="Products processed" 
            icon={<Package className="h-8 w-8 text-info" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {/* Integrate the Orders component here */}
            <Orders 
              orders={assignedOrders} 
              onAddOrder={(newOrder) => updateAssignedOrders([...assignedOrders, newOrder])}
              onRemoveOrder={(orderId) => updateAssignedOrders(assignedOrders.filter(order => order.id !== orderId))}
              onUpdateOrder={(orderId, updatedProducts) => {
                const updatedOrders = assignedOrders.map(order => 
                  order.id === orderId ? { ...order, products: updatedProducts } : order
                );
                updateAssignedOrders(updatedOrders);
              }}
              onStatusChange={handleStatusChange}
            />
          </div>

          <div>
            <Card title="Barcode Scanner" description="Scan items for current orders">
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Scan or enter product barcode"
                  value={barcodeScan}
                  onChange={(e) => setBarcodeScan(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleScanItem}>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Quick scan: Type product name and click Scan
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setBarcodeScan("Milk")}>
                  Fresh Milk
                </Button>
                <Button variant="outline" onClick={() => setBarcodeScan("Eggs")}>
                  Organic Eggs
                </Button>
                <Button variant="outline" onClick={() => setBarcodeScan("Bread")}>
                  Wheat Bread
                </Button>
                <Button variant="outline" onClick={() => setBarcodeScan("Coffee")}>
                  Premium Coffee
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <WarehouseMap />

        <Inventory orders={assignedOrders} />
      </div>
    </DashboardLayout>
  );
};

export default WarehouseStaffDashboard;