
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { 
  BarChart4, 
  PackageOpen, 
  Truck, 
  Users, 
  ShoppingCart, 
  Store, 
  AlertCircle,
  PlusCircle,
  ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    stores,
    staff,
    inventory,
    lowStockAlerts,
    orders,
    deliveries,
    storeCount,
    orderCount,
    inventoryCount,
    staffCount,
    addStaffMember,
    requestRestock
  } = useWarehouse();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Picker",
    storeId: ""
  });

  // Filter to pending orders
  const pendingOrders = orders.filter(order => 
    ["Pending", "Processing", "Picking", "Packing"].includes(order.status)
  );

  // Filter to active deliveries
  const activeDeliveries = deliveries.filter(delivery => 
    ["In Transit", "Preparing", "Picked Up", "En Route"].includes(delivery.status)
  );

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.storeId) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    addStaffMember({
      name: newStaff.name,
      role: newStaff.role,
      storeId: newStaff.storeId
    });

    setNewStaff({
      name: "",
      role: "Picker",
      storeId: ""
    });
    setDialogOpen(false);
  };

  const handleRestockRequest = (alertId: number) => {
    const alert = lowStockAlerts.find(a => a.id === alertId);
    if (!alert) return;
    
    const itemToRestock = inventory.find(item => 
      item.product === alert.product && 
      stores.find(s => s.name === alert.store)?.id === item.storeId
    );
    
    if (itemToRestock) {
      requestRestock(itemToRestock.id);
    }
  };
  
  const viewStaff = () => {
    navigate("/staff");
  };
  
  const viewInventory = () => {
    navigate("/inventory");
  };
  
  const viewOrders = () => {
    navigate("/orders");
  };
  
  const viewDeliveries = () => {
    navigate("/deliveries");
  };

  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Total Dark Stores" 
            value={storeCount.toString()} 
            description="Active locations" 
            icon={<Store className="h-8 w-8 text-primary" />} 
          />
          <Stats 
            title="Total Orders" 
            value={orderCount.toString()} 
            description="Last 30 days" 
            icon={<ShoppingCart className="h-8 w-8 text-info" />} 
          />
          <Stats 
            title="Stock Items" 
            value={inventoryCount.toString()} 
            description="Across all stores" 
            icon={<PackageOpen className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Staff Members" 
            value={staffCount.toString()} 
            description="Active employees" 
            icon={<Users className="h-8 w-8 text-warning" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Store Performance" description="Overview of all dark stores">
            <DataTable 
              data={stores} 
              columns={[
                { key: "name", title: "Store" },
                { key: "manager", title: "Manager" },
                { key: "orders", title: "Orders" },
                { key: "stock", title: "Stock Items" },
                { 
                  key: "alerts", 
                  title: "Alerts", 
                  render: (value, row) => (
                    <span className={`flex items-center ${row.alerts > 0 ? "text-destructive" : "text-success"}`}>
                      {row.alerts} {row.alerts > 0 && <AlertCircle className="h-4 w-4 ml-1" />}
                    </span>
                  )
                },
              ]}
            />
            
            <div className="mt-4 text-right">
              <Button variant="outline" onClick={viewInventory}>
                View Inventory <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card title="Low Stock Alerts" description="Items that need replenishment">
            <DataTable 
              data={lowStockAlerts} 
              columns={[
                { key: "product", title: "Product" },
                { key: "store", title: "Store" },
                { key: "current", title: "Current" },
                { key: "minimum", title: "Minimum" },
                { 
                  key: "status", 
                  title: "Status", 
                  render: (value, row) => {
                    const statusColors: Record<string, string> = {
                      Critical: "bg-destructive text-destructive-foreground",
                      Low: "bg-warning text-warning-foreground"
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
                    <Button 
                      size="sm" 
                      onClick={() => handleRestockRequest(row.id)}
                    >
                      Restock
                    </Button>
                  )
                }
              ]}
            />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Pending Orders" description="Orders in processing">
            <DataTable 
              data={pendingOrders} 
              columns={[
                { key: "id", title: "Order ID" },
                { key: "retailer", title: "Retailer" },
                { key: "value", title: "Value", render: (value) => `₹${value.toFixed(2)}` },
                { key: "storeId", title: "Store" },
                { 
                  key: "status", 
                  title: "Status", 
                  render: (value, row) => {
                    const statusColors: Record<string, string> = {
                      Pending: "bg-secondary text-secondary-foreground",
                      Processing: "bg-warning text-warning-foreground",
                      Picking: "bg-info text-info-foreground",
                      Packing: "bg-primary text-primary-foreground"
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    );
                  }
                },
              ]}
            />
            
            <div className="mt-4 text-right">
              <Button variant="outline" onClick={viewOrders}>
                View All Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card title="Active Deliveries" description="Current shipments">
            <DataTable 
              data={activeDeliveries} 
              columns={[
                { key: "id", title: "Tracking ID" },
                { key: "retailer", title: "Retailer" },
                { key: "driver", title: "Driver" },
                { key: "store", title: "Store" },
                { 
                  key: "status", 
                  title: "Status", 
                  render: (value, row) => {
                    const statusColors: Record<string, string> = {
                      "In Transit": "bg-info text-info-foreground",
                      "En Route": "bg-info text-info-foreground",
                      Delivered: "bg-success text-success-foreground",
                      Preparing: "bg-warning text-warning-foreground",
                      "Picked Up": "bg-primary text-primary-foreground"
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    );
                  }
                },
              ]}
            />
            
            <div className="mt-4 text-right">
              <Button variant="outline" onClick={viewDeliveries}>
                View All Deliveries <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card title="Staff Management" description="Warehouse personnel">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Active Staff Members</h3>
              <Button onClick={() => setDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Staff
              </Button>
            </div>
            
            <DataTable 
              data={staff.filter(s => s.active)} 
              columns={[
                { key: "name", title: "Name" },
                { key: "role", title: "Role" },
                { key: "storeId", title: "Store" },
                { key: "assigned", title: "Assigned Orders" },
                { key: "completed", title: "Completed Orders" },
              ]}
            />
            
            <div className="mt-4 text-right">
              <Button variant="outline" onClick={viewStaff}>
                Manage Staff <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Add Staff Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                placeholder="Enter staff name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newStaff.role} 
                onValueChange={(value) => setNewStaff({...newStaff, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Picker">Picker</SelectItem>
                  <SelectItem value="Packer">Packer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="store">Assign to Store</Label>
              <Select 
                value={newStaff.storeId} 
                onValueChange={(value) => setNewStaff({...newStaff, storeId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
