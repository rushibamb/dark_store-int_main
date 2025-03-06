import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useInventory } from "@/contexts/InventoryContext"; // Correct the import path

const StoreManagerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { orders: assignedOrders } = useInventory();
  const [completedToday, setCompletedToday] = useState<number>(0);
  const [totalItemsPicked, setTotalItemsPicked] = useState<number>(0);
  const [staffName, setStaffName] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [staffList, setStaffList] = useState<{ name: string, task: string }[]>([]);
  const [retailerOrders, setRetailerOrders] = useState<Order[]>([]);

  // Calculate completed orders and items picked whenever assignedOrders changes
  useEffect(() => {
    const completedCount = assignedOrders.filter(order => order.status === "Completed").length;
    setCompletedToday(completedCount);

    const itemsPickedCount = assignedOrders.reduce((total, order) => {
      return total + order.products.filter(product => product.picked).length;
    }, 0);
    setTotalItemsPicked(itemsPickedCount);
  }, [assignedOrders]);

  useEffect(() => {
    // Fetch retailer orders from an API or other data source
    const fetchRetailerOrders = async () => {
      // Replace with your data fetching logic
      const data: Order[] = await fetch('/api/retailer-orders').then(res => res.json());
      setRetailerOrders(data);
    };

    fetchRetailerOrders();
  }, []);

  const handleAddStaff = () => {
    if (!staffName.trim() || !task.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter both staff name and task",
        variant: "destructive",
      });
      return;
    }

    // Add staff to the list
    setStaffList([...staffList, { name: staffName, task }]);

    toast({
      title: "Staff added",
      description: `${staffName} assigned to ${task}`,
    });

    setStaffName("");
    setTask("");
  };

  const handleAssignOrder = (orderId: string, staffName: string) => {
    // Logic to assign order to staff
    toast({
      title: "Order assigned",
      description: `Order ${orderId} assigned to ${staffName}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Store Manager Dashboard</h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          {user?.name ? `Welcome, ${user.name}` : "Store Operations"}
        </h2>

        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Stats 
                title="Total Inventory Items" 
                value="10" 
                description="↑ 3.2% vs. last week" 
                icon={<TrendingUp className="h-8 w-8 text-success" />} 
                className="bg-blue-100 border border-blue-300"
              />
              <Stats 
                title="Stock Utilization" 
                value="75%" 
                description="↑ 1.8% vs. last week" 
                icon={<TrendingUp className="h-8 w-8 text-success" />} 
                className="bg-green-100 border border-green-300"
              />
              <Stats 
                title="Low Stock Items" 
                value="0" 
                description="↓ 5.1% vs. last week" 
                icon={<TrendingDown className="h-8 w-8 text-danger" />} 
                className="bg-yellow-100 border border-yellow-300"
              />
              <Stats 
                title="Out of Stock" 
                value="0" 
                description="↓ 2.3% vs. last week" 
                icon={<TrendingDown className="h-8 w-8 text-danger" />} 
                className="bg-red-100 border border-red-300"
              />
            </div>
          } />
          <Route path="/inventory" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-3">
                <Inventory 
                  orders={assignedOrders} 
                  className="bg-white border border-gray-300 p-4 rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          } />
          <Route path="/orders" element={
            <Card title="Recent Orders" description="Order status and details" className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
              {/* Add your orders component or code here */}
            </Card>
          } />
          <Route path="/warehouse" element={
            <Card title="Warehouse Map" description="View the warehouse layout" className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
              {/* Add your warehouse map component or code here */}
            </Card>
          } />
        </Routes>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            <Inventory 
              orders={assignedOrders} 
              className="bg-white border border-gray-300 p-4 rounded-lg shadow-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Add Staff and Assign Task" description="Manage staff and assign tasks" className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <div className="flex flex-col space-y-2 mb-4">
              <Input
                placeholder="Enter staff name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select task</option>
                <option value="Pick">Pick</option>
                <option value="Pack">Pack</option>
                <option value="Deliver">Deliver</option>
              </select>
              <Button onClick={handleAddStaff} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </Card>

          <Card title="Staff List" description="Current staff and their tasks" className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b bg-gray-100">Staff Name</th>
                  <th className="py-2 px-4 border-b bg-gray-100">Task</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{staff.name}</td>
                    <td className="py-2 px-4 border-b">{staff.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <Card title="Process Bulk Orders: Retailer Order Management" description="View orders from retailers and assign orders to pickers/packers" className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b bg-gray-100">Order ID</th>
                  <th className="py-2 px-4 border-b bg-gray-100">Retailer</th>
                  <th className="py-2 px-4 border-b bg-gray-100">Status</th>
                  <th className="py-2 px-4 border-b bg-gray-100">Assign To</th>
                  <th className="py-2 px-4 border-b bg-gray-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {retailerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{order.id}</td>
                    <td className="py-2 px-4 border-b">{order.retailer}</td>
                    <td className="py-2 px-4 border-b">{order.status}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        className="p-2 border border-gray-300 rounded-lg"
                        onChange={(e) => handleAssignOrder(order.id, e.target.value)}
                      >
                        <option value="">Select staff</option>
                        {staffList.map((staff) => (
                          <option key={staff.name} value={staff.name}>{staff.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Button onClick={() => handleAssignOrder(order.id, staffName)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreManagerDashboard;
