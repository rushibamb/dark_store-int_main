import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { 
  PackageOpen, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const mockInventory = [
  { id: 1, product: "Fresh Milk", category: "Dairy", stock: 35, min: 20, status: "OK" },
  { id: 2, product: "Organic Eggs", category: "Dairy", stock: 12, min: 15, status: "Low" },
  { id: 3, product: "Whole Wheat Bread", category: "Bakery", stock: 8, min: 10, status: "Low" },
  { id: 4, product: "Premium Coffee", category: "Beverages", stock: 22, min: 5, status: "OK" },
  { id: 5, product: "Fresh Apples", category: "Produce", stock: 45, min: 15, status: "OK" },
  { id: 6, product: "Chicken Breast", category: "Meat", stock: 3, min: 8, status: "Critical" },
  { id: 7, product: "Frozen Pizza", category: "Frozen", stock: 18, min: 10, status: "OK" },
  { id: 8, product: "Cheddar Cheese", category: "Dairy", stock: 7, min: 12, status: "Low" },
];

const mockOrders = [
  { id: "ORD-7801", retailer: "Metro Supermarket", items: 15, value: 345.78, status: "Pending", assigned: "" },
  { id: "ORD-7802", retailer: "Fresh Mart", items: 8, value: 124.50, status: "Assigned", assigned: "John Smith" },
  { id: "ORD-7803", retailer: "Corner Grocers", items: 23, value: 567.20, status: "Picking", assigned: "Maria Garcia" },
  { id: "ORD-7804", retailer: "Organica Foods", items: 12, value: 289.99, status: "Packing", assigned: "Robert Johnson" },
  { id: "ORD-7805", retailer: "Health Store", items: 5, value: 87.65, status: "Ready", assigned: "Maria Garcia" },
];

const mockStaff = [
  { id: 1, name: "John Smith", role: "Picker", assigned: 1, completed: 34 },
  { id: 2, name: "Maria Garcia", role: "Picker", assigned: 2, completed: 28 },
  { id: 3, name: "Robert Johnson", role: "Packer", assigned: 1, completed: 22 },
  { id: 4, name: "Emily Davis", role: "Packer", assigned: 0, completed: 19 },
  { id: 5, name: "David Wilson", role: "Picker", assigned: 0, completed: 15 },
];

const StoreManagerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleAssignOrder = (order: any) => {
    toast({
      title: "Staff assigned",
      description: `Order ${order.id} has been assigned for processing`,
    });
  };
  
  const handleRestockRequest = (product: any) => {
    toast({
      title: "Restock requested",
      description: `Restock request sent for ${product.product}`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Store Manager Dashboard</h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          {user?.storeId ? `Managing Store: ${user.storeId}` : "Store Management"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Pending Orders" 
            value="3" 
            description="Need processing" 
            icon={<Clock className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Inventory Items" 
            value="248" 
            description="In stock" 
            icon={<PackageOpen className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Low Stock Alerts" 
            value="8" 
            description="Need attention" 
            icon={<ShoppingCart className="h-8 w-8 text-destructive" />} 
          />
          <Stats 
            title="Staff Members" 
            value="5" 
            description="Active today" 
            icon={<Users className="h-8 w-8 text-info" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Current Orders" description="Manage retailer orders">
            <DataTable 
              data={mockOrders} 
              columns={[
                { key: "id", title: "Order ID" },
                { key: "retailer", title: "Retailer" },
                { key: "value", title: "Value", render: (value) => `$${value.toFixed(2)}` },
                { 
                  key: "status", 
                  title: "Status", 
                  render: (value, row) => {
                    const statusColors: Record<string, string> = {
                      Pending: "bg-secondary text-secondary-foreground",
                      Assigned: "bg-warning text-warning-foreground",
                      Picking: "bg-info text-info-foreground",
                      Packing: "bg-primary text-primary-foreground",
                      Ready: "bg-success text-success-foreground"
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    );
                  }
                },
                { 
                  key: "assigned", 
                  title: "Action", 
                  render: (value, row) => (
                    row.status === "Pending" ? (
                      <Button size="sm" onClick={() => handleAssignOrder(row)}>
                        Assign
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {row.assigned ? `Assigned to ${row.assigned}` : ""}
                      </span>
                    )
                  )
                },
              ]}
            />
          </Card>
          
          <Card title="Staff Management" description="Warehouse staff status">
            <DataTable 
              data={mockStaff} 
              columns={[
                { key: "name", title: "Name" },
                { key: "role", title: "Role" },
                { 
                  key: "assigned", 
                  title: "Status", 
                  render: (value, row) => (
                    row.assigned > 0 ? (
                      <span className="text-warning flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Working ({row.assigned} orders)
                      </span>
                    ) : (
                      <span className="text-success flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" /> Available
                      </span>
                    )
                  )
                },
                { key: "completed", title: "Completed Today" },
              ]}
            />
          </Card>
        </div>
        
        <Card title="Inventory Management" description="Current stock levels">
          <DataTable 
            data={mockInventory} 
            columns={[
              { key: "product", title: "Product" },
              { key: "category", title: "Category" },
              { key: "stock", title: "Current Stock" },
              { key: "min", title: "Min. Level" },
              { 
                key: "status", 
                title: "Status", 
                render: (value, row) => {
                  const statusColors: Record<string, string> = {
                    OK: "bg-success text-success-foreground",
                    Low: "bg-warning text-warning-foreground",
                    Critical: "bg-destructive text-destructive-foreground"
                  };
                  return (
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status]}`}>
                      {row.status}
                    </span>
                  );
                }
              },
              { 
                key: "id", 
                title: "Action", 
                render: (value, row) => (
                  row.status !== "OK" ? (
                    <Button size="sm" onClick={() => handleRestockRequest(row)}>
                      Restock
                    </Button>
                  ) : (
                    <span className="text-success flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> Sufficient
                    </span>
                  )
                )
              },
            ]}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreManagerDashboard;
