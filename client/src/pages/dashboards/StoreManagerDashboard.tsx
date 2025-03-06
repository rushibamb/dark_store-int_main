
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PackageOpen, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Printer,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWarehouse } from "@/contexts/WarehouseContext";

const StoreManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    inventory, 
    staff, 
    orders, 
    getStoreInventory, 
    getStoreStaff, 
    getStoreOrders,
    assignOrder,
    requestRestock
  } = useWarehouse();
  
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  
  // Get the user's store ID
  const userStoreId = user?.storeId || "store1";
  
  // Get store-specific data
  const storeInventory = getStoreInventory(userStoreId);
  const storeStaff = getStoreStaff(userStoreId);
  const storeOrders = getStoreOrders(userStoreId);
  
  // Stats calculations
  const pendingOrdersCount = storeOrders.filter(order => 
    ["Pending", "Assigned"].includes(order.status)
  ).length;
  
  const lowStockCount = storeInventory.filter(item => 
    item.status === "Low" || item.status === "Critical"
  ).length;
  
  // Filter to current orders
  const currentOrders = storeOrders.filter(order => 
    ["Pending", "Assigned", "Picking", "Packing", "Ready"].includes(order.status)
  );
  
  const handleAssignOrder = (order: any) => {
    if (!order.id) return;
    
    // Dialog state to assign staff
    const [assignDialog, setAssignDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");
    
    const openAssignDialog = (orderId: string) => {
      setSelectedOrderId(orderId);
      setSelectedStaff("");
      setAssignDialog(true);
    };
    
    const handleAssign = () => {
      if (!selectedOrderId || !selectedStaff) return;
      
      assignOrder(selectedOrderId, selectedStaff);
      setAssignDialog(false);
    };
    
    return (
      <>
        <Button size="sm" onClick={() => openAssignDialog(order.id)}>
          Assign
        </Button>
        
        {/* Assign Staff Dialog */}
        <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Order to Staff</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="staff">Select Staff Member</Label>
                <Select 
                  value={selectedStaff} 
                  onValueChange={setSelectedStaff}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeStaff.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name} ({member.role}) - {member.assigned} assigned
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign}>
                Assign Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  const handleRestockRequest = (product: any) => {
    if (!product || !product.id) return;
    requestRestock(product.id);
  };
  
  const handleGenerateInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    setInvoiceDialog(true);
  };
  
  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order ${selectedOrderId} has been downloaded`,
    });
    setInvoiceDialog(false);
  };
  
  const handlePrintInvoice = () => {
    toast({
      title: "Invoice Printed",
      description: `Invoice for order ${selectedOrderId} has been sent to printer`,
    });
    setInvoiceDialog(false);
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
            value={pendingOrdersCount.toString()} 
            description="Need processing" 
            icon={<Clock className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Inventory Items" 
            value={storeInventory.length.toString()} 
            description="In stock" 
            icon={<PackageOpen className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Low Stock Alerts" 
            value={lowStockCount.toString()} 
            description="Need attention" 
            icon={<ShoppingCart className="h-8 w-8 text-destructive" />} 
          />
          <Stats 
            title="Staff Members" 
            value={storeStaff.length.toString()} 
            description="Active today" 
            icon={<Users className="h-8 w-8 text-info" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Current Orders" description="Manage retailer orders">
            <DataTable 
              data={currentOrders} 
              columns={[
                { key: "id", title: "Order ID" },
                { key: "retailer", title: "Retailer" },
                { key: "value", title: "Value", render: (value) => `₹${value.toFixed(2)}` },
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
                    <div className="flex space-x-2">
                      {row.status === "Pending" ? (
                        <Button size="sm" onClick={() => handleAssignOrder(row)}>
                          Assign
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {row.assigned ? `Assigned to ${row.assigned}` : ""}
                        </span>
                      )}
                      
                      {row.status === "Ready" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleGenerateInvoice(row.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Invoice
                        </Button>
                      )}
                    </div>
                  )
                },
              ]}
            />
          </Card>
          
          <Card title="Staff Management" description="Warehouse staff status">
            <DataTable 
              data={storeStaff} 
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
            data={storeInventory} 
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
      
      {/* Invoice Dialog */}
      <Dialog open={invoiceDialog} onOpenChange={setInvoiceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold">StockPulse</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {userStoreId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    123 Store Location, City
                  </p>
                </div>
                
                <div className="text-right">
                  <h3 className="text-lg font-semibold">INVOICE</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Invoice #: INV-{selectedOrderId.split('-')[1]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-medium mb-2">Bill To:</h4>
                  {selectedOrderId && (
                    <>
                      <p className="font-medium">
                        {orders.find(o => o.id === selectedOrderId)?.retailer || "Retailer"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Retailer Address Line 1
                      </p>
                      <p className="text-sm text-muted-foreground">
                        City, State ZIP
                      </p>
                    </>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order Information:</h4>
                  <p className="text-sm">
                    <span className="font-medium">Order ID:</span> {selectedOrderId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Order Date:</span> {
                      orders.find(o => o.id === selectedOrderId)?.date || new Date().toLocaleDateString()
                    }
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> {
                      orders.find(o => o.id === selectedOrderId)?.status || "Ready"
                    }
                  </p>
                </div>
              </div>
              
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Item</th>
                    <th className="text-center py-2 font-medium">Quantity</th>
                    <th className="text-center py-2 font-medium">Price</th>
                    <th className="text-right py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderId && orders.find(o => o.id === selectedOrderId)?.products?.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2 text-center">{product.quantity}</td>
                      <td className="py-2 text-center">${product.price.toFixed(2)}</td>
                      <td className="py-2 text-right">${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-4 font-medium">Subtotal:</td>
                    <td className="text-right py-4">${
                      orders.find(o => o.id === selectedOrderId)?.value.toFixed(2) || "0.00"
                    }</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-medium">Tax (10%):</td>
                    <td className="text-right py-2">${
                      ((orders.find(o => o.id === selectedOrderId)?.value || 0) * 0.1).toFixed(2)
                    }</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-4 font-bold">Total:</td>
                    <td className="text-right py-4 font-bold">${
                      ((orders.find(o => o.id === selectedOrderId)?.value || 0) * 1.1).toFixed(2)
                    }</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="mt-8 border-t pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Thank you for your business. For any inquiries, please contact support@stockpulse.com
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceDialog(false)}>
              Close
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrintInvoice}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoreManagerDashboard;
