import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { 
  BarChart, 
  PackageOpen, 
  Truck, 
  Users, 
  ShoppingCart, 
  Store, 
  AlertCircle
} from "lucide-react";

// Mock data
const mockStores = [
  { id: 1, name: "Downtown Store", manager: "praneet more", orders: 145, stock: 1250, alerts: 2 },
  { id: 2, name: "Westside Location", manager: "Sham shete", orders: 98, stock: 875, alerts: 0 },
  { id: 3, name: "North Mall Store", manager: "Ganesh Kale", orders: 210, stock: 1650, alerts: 5 },
  { id: 4, name: "East End Dark Store", manager: "Rama deshmane", orders: 65, stock: 920, alerts: 1 },
];

const mockLowStock = [
  { id: 1, product: "Organic Milk", store: "Downtown Store", current: 5, minimum: 20, status: "Critical" },
  { id: 2, product: "Premium Coffee", store: "North Mall Store", current: 8, minimum: 15, status: "Low" },
  { id: 3, product: "Whole Wheat Bread", store: "Westside Location", current: 12, minimum: 25, status: "Low" },
  { id: 4, product: "Fresh Chicken", store: "East End Dark Store", current: 3, minimum: 10, status: "Critical" },
  { id: 5, product: "Organic Eggs", store: "Downtown Store", current: 14, minimum: 30, status: "Low" },
];

const mockPendingOrders = [
  { id: "ORD-2345", retailer: "Metro Supermarket", items: 45, value: 1250, store: "Downtown Store", status: "Processing" },
  { id: "ORD-2346", retailer: "Fresh Mart", items: 28, value: 780, store: "Westside Location", status: "Pending" },
  { id: "ORD-2347", retailer: "Corner Grocers", items: 12, value: 350, store: "East End Dark Store", status: "Picking" },
  { id: "ORD-2348", retailer: "Organica Foods", items: 34, value: 1100, store: "North Mall Store", status: "Packing" },
];

const mockDeliveries = [
  { id: "DEL-567", retailer: "Metro Supermarket", driver: "Sanket Mahadik", store: "Downtown Store", status: "In Transit" },
  { id: "DEL-568", retailer: "Fresh Mart", driver: "Dhanush Kalyan", store: "Westside Location", status: "Delivered" },
  { id: "DEL-569", retailer: "Corner Grocers", driver: "Anthony shaikh", store: "East End Dark Store", status: "Preparing" },
  { id: "DEL-570", retailer: "Organica Foods", driver: "Shahrukh Khan", store: "North Mall Store", status: "Delivered" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Total Dark Stores" 
            value="4" 
            description="Active locations" 
            icon={<Store className="h-8 w-8 text-primary" />} 
          />
          <Stats 
            title="Total Orders" 
            value="518" 
            description="Last 30 days" 
            icon={<ShoppingCart className="h-8 w-8 text-info" />} 
          />
          <Stats 
            title="Stock Items" 
            value="4,695" 
            description="Across all stores" 
            icon={<PackageOpen className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Staff Members" 
            value="42" 
            description="Active employees" 
            icon={<Users className="h-8 w-8 text-warning" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Store Performance" description="Overview of all dark stores">
            <DataTable 
              data={mockStores} 
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
          </Card>
          
          <Card title="Low Stock Alerts" description="Items that need replenishment">
            <DataTable 
              data={mockLowStock} 
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
              ]}
            />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Pending Orders" description="Orders in processing">
            <DataTable 
              data={mockPendingOrders} 
              columns={[
                { key: "id", title: "Order ID" },
                { key: "retailer", title: "Retailer" },
                { key: "value", title: "Value", render: (value) => `₹${value.toFixed(2)}` },
                { key: "store", title: "Store" },
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
          </Card>
          
          <Card title="Active Deliveries" description="Current shipments">
            <DataTable 
              data={mockDeliveries} 
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
                      Delivered: "bg-success text-success-foreground",
                      Preparing: "bg-warning text-warning-foreground"
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
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
