import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Package, 
  Clock, 
  BarChart4, 
  Scan, 
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const mockAssignedOrders = [
  { 
    id: "ORD-6321", 
    retailer: "Metro Supermarket", 
    status: "Picking", 
    products: [
      { id: 1, name: "Fresh Milk", quantity: 5, picked: false },
      { id: 2, name: "Organic Eggs", quantity: 2, picked: false },
      { id: 3, name: "Whole Wheat Bread", quantity: 3, picked: true },
    ],
    progress: 33,
  },
  { 
    id: "ORD-6322", 
    retailer: "Fresh Mart", 
    status: "Picking", 
    products: [
      { id: 4, name: "Premium Coffee", quantity: 2, picked: true },
      { id: 5, name: "Fresh Apples", quantity: 4, picked: true },
      { id: 6, name: "Chicken Breast", quantity: 1, picked: true },
    ],
    progress: 100,
  },
];

const mockCompletedOrders = [
  { id: "ORD-6310", retailer: "Corner Grocers", completedAt: "10:25 AM", items: 8 },
  { id: "ORD-6311", retailer: "Organica Foods", completedAt: "11:40 AM", items: 12 },
  { id: "ORD-6312", retailer: "Health Store", completedAt: "01:15 PM", items: 5 },
];

const WarehouseStaffDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [barcodeScan, setBarcodeScan] = useState("");
  const [assignedOrders, setAssignedOrders] = useState(mockAssignedOrders);
  
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
      if (order.status !== "Picking") continue;
      
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
    
    setAssignedOrders(updatedOrders);
    setBarcodeScan("");
  };
  
  const handleCompleteOrder = (orderId: string) => {
    const updatedOrders = assignedOrders.filter(order => order.id !== orderId);
    
    toast({
      title: "Order completed",
      description: `Order ${orderId} has been completed and is ready for shipping`,
    });
    
    setAssignedOrders(updatedOrders);
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
            value="3" 
            description="Orders fulfilled" 
            icon={<CheckCircle2 className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Items Picked" 
            value="25" 
            description="Products processed" 
            icon={<Package className="h-8 w-8 text-info" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card title="Current Orders" description="Your assigned tasks">
              {assignedOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Done!</h3>
                  <p className="text-muted-foreground">
                    You've completed all your assigned orders. Check back soon for new tasks.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {assignedOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.retailer}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Picking" 
                              ? "bg-warning text-warning-foreground" 
                              : "bg-info text-info-foreground"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="h-2 bg-muted rounded overflow-hidden mb-4">
                        <div 
                          className="h-full bg-success" 
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      
                      <ul className="space-y-2 mb-4">
                        {order.products.map(product => (
                          <li key={product.id} className="flex justify-between items-center">
                            <span className="flex items-center">
                              {product.picked ? (
                                <Check className="h-4 w-4 text-success mr-2" />
                              ) : (
                                <span className="h-4 w-4 border border-muted-foreground rounded-full mr-2"></span>
                              )}
                              {product.name} (x{product.quantity})
                            </span>
                            <span className={product.picked ? "text-success" : "text-muted-foreground"}>
                              {product.picked ? "Picked" : "Pending"}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {order.status === "Packing" && (
                        <Button className="w-full" onClick={() => handleCompleteOrder(order.id)}>
                          Complete Order
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
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
            
            <Card title="Completed Orders" description="Your fulfilled orders today" className="mt-6">
              <DataTable 
                data={mockCompletedOrders} 
                columns={[
                  { key: "id", title: "Order ID" },
                  { key: "retailer", title: "Retailer" },
                  { key: "completedAt", title: "Time" },
                  { key: "items", title: "Items" },
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WarehouseStaffDashboard;
