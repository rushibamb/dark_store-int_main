import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Package, Truck, Clock } from "lucide-react";

// Mock data
const mockProducts = [
  { id: 1, name: "Fresh Milk", category: "Dairy", price: 2.99, stock: 145 },
  { id: 2, name: "Whole Wheat Bread", category: "Bakery", price: 3.49, stock: 78 },
  { id: 3, name: "Organic Eggs", category: "Dairy", price: 4.99, stock: 52 },
  { id: 4, name: "Premium Coffee", category: "Beverages", price: 12.99, stock: 34 },
  { id: 5, name: "Fresh Apples", category: "Produce", price: 1.99, stock: 210 },
  { id: 6, name: "Chicken Breast", category: "Meat", price: 8.99, stock: 56 },
  { id: 7, name: "Frozen Pizza", category: "Frozen", price: 5.99, stock: 88 },
  { id: 8, name: "Cheddar Cheese", category: "Dairy", price: 4.49, stock: 67 },
];

const mockOrders = [
  { id: "ORD-1234", date: "2023-06-01", status: "Delivered", total: 78.45, items: 12 },
  { id: "ORD-1235", date: "2023-06-03", status: "Processing", total: 145.20, items: 8 },
  { id: "ORD-1236", date: "2023-06-05", status: "Shipped", total: 34.99, items: 3 },
  { id: "ORD-1237", date: "2023-06-10", status: "Pending", total: 212.50, items: 15 },
];

const RetailerDashboard = () => {
  const [cart, setCart] = useState<any[]>([]);
  const { toast } = useToast();
  const [pendingOrders, setPendingOrders] = useState(mockOrders.filter(order => order.status === "Pending"));
  const [processingOrders, setProcessingOrders] = useState(mockOrders.filter(order => order.status === "Processing"));
  const [shippedOrders, setShippedOrders] = useState(mockOrders.filter(order => order.status === "Shipped"));

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your order`,
    });
  };
  
  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Order placed successfully",
      description: `Your order with ${cart.length} items has been placed`,
    });
    setCart([]);
  };
  
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Retailer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Pending Orders" 
            value={pendingOrders.length.toString()} 
            description="Awaiting fulfillment" 
            icon={<Clock className="h-8 w-8 text-info" />} 
          />
          <Stats 
            title="Processing" 
            value={processingOrders.length.toString()} 
            description="Being prepared" 
            icon={<Package className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Shipped" 
            value={shippedOrders.length.toString()} 
            description="On the way" 
            icon={<Truck className="h-8 w-8 text-primary" />} 
          />
          <Stats 
            title="Cart Items" 
            value={cart.reduce((sum, item) => sum + item.quantity, 0).toString()} 
            description="Ready to order" 
            icon={<ShoppingCart className="h-8 w-8 text-success" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Available Products" description="Browse and order products">
              <DataTable 
                data={mockProducts} 
                columns={[
                  { key: "name", title: "Product" },
                  { key: "category", title: "Category" },
                  { key: "price", title: "Price", render: (value) => `₹${value.toFixed(2)}` },
                  { key: "stock", title: "Stock" },
                  { 
                    key: "id", 
                    title: "Action", 
                    render: (value, row) => (
                      <Button size="sm" onClick={() => addToCart(row)}>Add to Cart</Button>
                    )
                  },
                ]}
              />
            </Card>
          </div>
          
          <div>
            <Card title="Your Cart" description="Review and place your order">
              {cart.length === 0 ? (
                <p className="text-muted-foreground py-4">Your cart is empty</p>
              ) : (
                <>
                  <ul className="divide-y">
                    {cart.map(item => (
                      <li key={item.id} className="py-2 flex justify-between">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full mt-4" onClick={placeOrder}>
                    Place Order
                  </Button>
                </>
              )}
            </Card>
            
            <Card title="Order History" description="Track your past orders" className="mt-6">
              <DataTable 
                data={mockOrders} 
                columns={[
                  { key: "id", title: "Order ID" },
                  { key: "date", title: "Date" },
                  { key: "total", title: "Total", render: (value) => `₹${value.toFixed(2)}` },
                  { 
                    key: "status", 
                    title: "Status", 
                    render: (value, row) => {
                      const statusColors: Record<string, string> = {
                        Delivered: "bg-success text-success-foreground",
                        Processing: "bg-warning text-warning-foreground",
                        Shipped: "bg-info text-info-foreground",
                        Pending: "bg-secondary text-secondary-foreground"
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
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboard;
