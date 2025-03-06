
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Package, Truck, Clock, Minus, Plus, ArrowRight } from "lucide-react";
import { useWarehouse } from "@/contexts/WarehouseContext";

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    inventory, 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    placeOrder, 
    orders,
    deliveries 
  } = useWarehouse();
  
  // Counts for the stats cards
  const pendingCount = orders.filter(order => order.status === "Pending" || order.status === "Processing").length;
  const processingCount = orders.filter(order => order.status === "Assigned" || order.status === "Picking" || order.status === "Packing").length;
  const shippedCount = orders.filter(order => order.status === "Shipped" || order.status === "Ready").length;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Add mock prices to inventory items for display and cart functionality
  const availableProducts = inventory
    .filter(item => item.stock > 0)
    .map(item => ({
      ...item,
      price: parseFloat((Math.random() * 20 + 1).toFixed(2)), // Mock price between $1-$21
    }));
  
  // Filter for order history (all completed orders)
  const orderHistory = orders.filter(order => 
    ["Ready", "Shipped", "Delivered"].includes(order.status)
  );
  
  const handleQuantityChange = (productId: number, change: number) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartItem(productId, newQuantity);
      }
    }
  };
  
  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.product,
      category: item.category,
      price: item.price,
      stock: item.stock,
    };
    addToCart(cartItem);
  };
  
  const viewOrders = () => {
    navigate("/orders");
  };
  
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Retailer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Pending Orders" 
            value={pendingCount.toString()} 
            description="Awaiting fulfillment" 
            icon={<Clock className="h-8 w-8 text-info" />} 
          />
          <Stats 
            title="Processing" 
            value={processingCount.toString()} 
            description="Being prepared" 
            icon={<Package className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Shipped" 
            value={shippedCount.toString()} 
            description="On the way" 
            icon={<Truck className="h-8 w-8 text-primary" />} 
          />
          <Stats 
            title="Cart Items" 
            value={cartItemsCount.toString()} 
            description="Ready to order" 
            icon={<ShoppingCart className="h-8 w-8 text-success" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Available Products" description="Browse and order products">
              <DataTable 
                data={availableProducts} 
                columns={[
                  { key: "product", title: "Product" },
                  { key: "category", title: "Category" },
                  { key: "price", title: "Price", render: (value) => `₹${value.toFixed(2)}` },
                  { key: "stock", title: "Available" },
                  { 
                    key: "id", 
                    title: "Action", 
                    render: (value, row) => (
                      <Button size="sm" onClick={() => handleAddToCart(row)}>Add to Cart</Button>
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
                      <li key={item.id} className="py-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6 rounded-full"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6 rounded-full"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
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
                data={orderHistory} 
                columns={[
                  { key: "id", title: "Order ID" },
                  { key: "date", title: "Date" },
                  { key: "value", title: "Total", render: (value) => `₹${value.toFixed(2)}` },
                  { 
                    key: "status", 
                    title: "Status", 
                    render: (value, row) => {
                      const statusColors: Record<string, string> = {
                        Delivered: "bg-success text-success-foreground",
                        Ready: "bg-warning text-warning-foreground",
                        Shipped: "bg-info text-info-foreground",
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboard;
