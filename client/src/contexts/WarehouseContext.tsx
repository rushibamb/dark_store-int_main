
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Types
export type InventoryItem = {
  id: number;
  product: string;
  category: string;
  stock: number;
  min: number;
  status: "OK" | "Low" | "Critical";
  location?: string;
  storeId: string;
};

export type Staff = {
  id: number;
  name: string;
  role: string;
  assigned: number;
  completed: number;
  storeId: string;
  active: boolean;
};

export type Order = {
  id: string;
  retailer: string;
  items: number;
  value: number;
  status: "Pending" | "Assigned" | "Picking" | "Packing" | "Ready" | "Shipped" | "Delivered" | "Processing";
  assigned: string;
  storeId: string;
  date: string;
  products?: OrderProduct[];
  progress?: number;
};

export type OrderProduct = {
  id: number;
  name: string;
  quantity: number;
  picked: boolean;
  price: number;
};

export type Store = {
  id: string;
  name: string;
  manager: string;
  orders: number;
  stock: number;
  alerts: number;
  location: string;
};

export type LowStockAlert = {
  id: number;
  product: string;
  store: string;
  current: number;
  minimum: number;
  status: "Critical" | "Low";
};

export type Delivery = {
  id: string;
  retailer: string;
  driver: string;
  store: string;
  status: "In Transit" | "Delivered" | "Preparing" | "Picked Up" | "En Route";
  eta?: string;
  address?: string;
  items?: number;
  pickupLocation?: string;
  pickupTime?: string;
  completedAt?: string;
};

export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  quantity: number;
};

// Context state interface
interface WarehouseContextType {
  // Data collections
  inventory: InventoryItem[];
  staff: Staff[];
  orders: Order[];
  stores: Store[];
  lowStockAlerts: LowStockAlert[];
  deliveries: Delivery[];
  cart: CartItem[];
  
  // Counts for dashboard stats
  inventoryCount: number;
  staffCount: number;
  orderCount: number;
  storeCount: number;
  lowStockCount: number;
  deliveryCount: number;
  
  // Action functions
  addInventoryItem: (item: Omit<InventoryItem, "id" | "status">) => void;
  updateInventoryItem: (id: number, updates: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: number) => void;
  
  addStaffMember: (member: Omit<Staff, "id" | "assigned" | "completed" | "active">) => void;
  updateStaffMember: (id: number, updates: Partial<Staff>) => void;
  removeStaffMember: (id: number) => void;
  
  createOrder: (order: Omit<Order, "id" | "date" | "progress">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  assignOrder: (orderId: string, staffName: string) => void;
  completeOrder: (orderId: string) => void;
  
  addDelivery: (delivery: Omit<Delivery, "id">) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
  
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  
  // Filter helpers
  getStoreInventory: (storeId: string) => InventoryItem[];
  getStoreStaff: (storeId: string) => Staff[];
  getStoreOrders: (storeId: string) => Order[];
  getAssignedOrders: (staffName: string) => Order[];
  getPendingOrders: () => Order[];
  getActiveDeliveries: () => Delivery[];
  getUpcomingDeliveries: () => Delivery[];
  getCompletedDeliveries: () => Delivery[];
  
  // Stock management
  requestRestock: (productId: number) => void;
}

// Create context
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// Initial data
const initialInventory: InventoryItem[] = [
  { id: 1, product: "Fresh Milk", category: "Dairy", stock: 35, min: 20, status: "OK", storeId: "store1", location: "A1" },
  { id: 2, product: "Organic Eggs", category: "Dairy", stock: 12, min: 15, status: "Low", storeId: "store1", location: "A2" },
  { id: 3, product: "Whole Wheat Bread", category: "Bakery", stock: 8, min: 10, status: "Low", storeId: "store1", location: "B1" },
  { id: 4, product: "Premium Coffee", category: "Beverages", stock: 22, min: 5, status: "OK", storeId: "store1", location: "B2" },
  { id: 5, product: "Fresh Apples", category: "Produce", stock: 45, min: 15, status: "OK", storeId: "store1", location: "C1" },
  { id: 6, product: "Chicken Breast", category: "Meat", stock: 3, min: 8, status: "Critical", storeId: "store1", location: "C2" },
  { id: 7, product: "Frozen Pizza", category: "Frozen", stock: 18, min: 10, status: "OK", storeId: "store1", location: "D1" },
  { id: 8, product: "Cheddar Cheese", category: "Dairy", stock: 7, min: 12, status: "Low", storeId: "store1", location: "D2" },
  { id: 9, product: "Fresh Milk", category: "Dairy", stock: 28, min: 20, status: "OK", storeId: "store2", location: "A1" },
  { id: 10, product: "Organic Eggs", category: "Dairy", stock: 5, min: 15, status: "Critical", storeId: "store2", location: "A2" },
  { id: 11, product: "Whole Wheat Bread", category: "Bakery", stock: 15, min: 10, status: "OK", storeId: "store2", location: "B1" },
  { id: 12, product: "Premium Coffee", category: "Beverages", stock: 8, min: 5, status: "OK", storeId: "store2", location: "B2" },
  { id: 13, product: "Fresh Milk", category: "Dairy", stock: 42, min: 20, status: "OK", storeId: "store3", location: "A1" },
  { id: 14, product: "Organic Eggs", category: "Dairy", stock: 18, min: 15, status: "OK", storeId: "store3", location: "A2" },
  { id: 15, product: "Whole Wheat Bread", category: "Bakery", stock: 9, min: 10, status: "Low", storeId: "store3", location: "B1" },
  { id: 16, product: "Premium Coffee", category: "Beverages", stock: 4, min: 5, status: "Low", storeId: "store3", location: "B2" },
  { id: 17, product: "Fresh Milk", category: "Dairy", stock: 30, min: 20, status: "OK", storeId: "store4", location: "A1" },
  { id: 18, product: "Organic Eggs", category: "Dairy", stock: 16, min: 15, status: "OK", storeId: "store4", location: "A2" },
  { id: 19, product: "Whole Wheat Bread", category: "Bakery", stock: 7, min: 10, status: "Low", storeId: "store4", location: "B1" },
  { id: 20, product: "Premium Coffee", category: "Beverages", stock: 3, min: 5, status: "Critical", storeId: "store4", location: "B2" },
];

const initialStaff: Staff[] = [
  { id: 1, name: "John Smith", role: "Picker", assigned: 1, completed: 34, storeId: "store1", active: true },
  { id: 2, name: "Maria Garcia", role: "Picker", assigned: 2, completed: 28, storeId: "store1", active: true },
  { id: 3, name: "Robert Johnson", role: "Packer", assigned: 1, completed: 22, storeId: "store1", active: true },
  { id: 4, name: "Emily Davis", role: "Packer", assigned: 0, completed: 19, storeId: "store1", active: true },
  { id: 5, name: "David Wilson", role: "Picker", assigned: 0, completed: 15, storeId: "store1", active: true },
  { id: 6, name: "Lisa Brown", role: "Picker", assigned: 1, completed: 26, storeId: "store2", active: true },
  { id: 7, name: "James Miller", role: "Packer", assigned: 0, completed: 18, storeId: "store2", active: true },
  { id: 8, name: "Sarah Wilson", role: "Picker", assigned: 2, completed: 24, storeId: "store3", active: true },
  { id: 9, name: "Michael Clark", role: "Packer", assigned: 1, completed: 20, storeId: "store3", active: true },
  { id: 10, name: "Jennifer Lee", role: "Picker", assigned: 0, completed: 17, storeId: "store4", active: true },
];

const initialOrders: Order[] = [
  { 
    id: "ORD-7801", 
    retailer: "Metro Supermarket", 
    items: 15, 
    value: 345.78, 
    status: "Pending", 
    assigned: "", 
    storeId: "store1", 
    date: "2023-06-01",
    products: [
      { id: 1, name: "Fresh Milk", quantity: 5, picked: false, price: 2.99 },
      { id: 2, name: "Organic Eggs", quantity: 2, picked: false, price: 4.99 },
      { id: 3, name: "Whole Wheat Bread", quantity: 3, picked: false, price: 3.49 },
    ],
    progress: 0,
  },
  { 
    id: "ORD-7802", 
    retailer: "Fresh Mart", 
    items: 8, 
    value: 124.50, 
    status: "Assigned", 
    assigned: "John Smith", 
    storeId: "store1", 
    date: "2023-06-02",
    products: [
      { id: 4, name: "Premium Coffee", quantity: 2, picked: false, price: 12.99 },
      { id: 5, name: "Fresh Apples", quantity: 4, picked: false, price: 1.99 },
      { id: 6, name: "Chicken Breast", quantity: 2, picked: false, price: 8.99 },
    ],
    progress: 0,
  },
  { 
    id: "ORD-7803", 
    retailer: "Corner Grocers", 
    items: 23, 
    value: 567.20, 
    status: "Picking", 
    assigned: "Maria Garcia", 
    storeId: "store1", 
    date: "2023-06-03",
    products: [
      { id: 7, name: "Frozen Pizza", quantity: 3, picked: true, price: 5.99 },
      { id: 8, name: "Cheddar Cheese", quantity: 1, picked: false, price: 4.49 },
    ],
    progress: 50,
  },
  { 
    id: "ORD-7804", 
    retailer: "Organica Foods", 
    items: 12, 
    value: 289.99, 
    status: "Packing", 
    assigned: "Robert Johnson", 
    storeId: "store1", 
    date: "2023-06-04",
    products: [
      { id: 9, name: "Fresh Milk", quantity: 3, picked: true, price: 2.99 },
      { id: 10, name: "Organic Eggs", quantity: 2, picked: true, price: 4.99 },
    ],
    progress: 100,
  },
  { 
    id: "ORD-7805", 
    retailer: "Health Store", 
    items: 5, 
    value: 87.65, 
    status: "Ready", 
    assigned: "Maria Garcia", 
    storeId: "store1", 
    date: "2023-06-05",
    products: [
      { id: 11, name: "Premium Coffee", quantity: 1, picked: true, price: 12.99 },
      { id: 12, name: "Fresh Apples", quantity: 2, picked: true, price: 1.99 },
    ],
    progress: 100,
  },
  { 
    id: "ORD-7806", 
    retailer: "Metro Supermarket", 
    items: 10, 
    value: 245.30, 
    status: "Pending", 
    assigned: "", 
    storeId: "store2", 
    date: "2023-06-03",
    products: [
      { id: 13, name: "Fresh Milk", quantity: 4, picked: false, price: 2.99 },
      { id: 14, name: "Organic Eggs", quantity: 3, picked: false, price: 4.99 },
    ],
    progress: 0,
  },
  { 
    id: "ORD-7807", 
    retailer: "Fresh Mart", 
    items: 7, 
    value: 178.45, 
    status: "Picking", 
    assigned: "Lisa Brown", 
    storeId: "store2", 
    date: "2023-06-04",
    products: [
      { id: 15, name: "Premium Coffee", quantity: 2, picked: true, price: 12.99 },
      { id: 16, name: "Whole Wheat Bread", quantity: 3, picked: false, price: 3.49 },
    ],
    progress: 50,
  },
  { 
    id: "ORD-7808", 
    retailer: "Corner Grocers", 
    items: 14, 
    value: 312.80, 
    status: "Picking", 
    assigned: "Sarah Wilson", 
    storeId: "store3", 
    date: "2023-06-02",
    products: [
      { id: 17, name: "Fresh Milk", quantity: 5, picked: true, price: 2.99 },
      { id: 18, name: "Organic Eggs", quantity: 2, picked: false, price: 4.99 },
    ],
    progress: 50,
  },
  { 
    id: "ORD-7809", 
    retailer: "Organica Foods", 
    items: 9, 
    value: 195.60, 
    status: "Packing", 
    assigned: "Michael Clark", 
    storeId: "store3", 
    date: "2023-06-03",
    products: [
      { id: 19, name: "Whole Wheat Bread", quantity: 4, picked: true, price: 3.49 },
      { id: 20, name: "Premium Coffee", quantity: 1, picked: true, price: 12.99 },
    ],
    progress: 100,
  },
  { 
    id: "ORD-7810", 
    retailer: "Health Store", 
    items: 6, 
    value: 134.25, 
    status: "Pending", 
    assigned: "", 
    storeId: "store4", 
    date: "2023-06-05",
    products: [
      { id: 21, name: "Fresh Milk", quantity: 3, picked: false, price: 2.99 },
      { id: 22, name: "Organic Eggs", quantity: 2, picked: false, price: 4.99 },
    ],
    progress: 0,
  },
];

const initialStores: Store[] = [
  { id: "store1", name: "Downtown Store", manager: "John Smith", orders: 145, stock: 1250, alerts: 2, location: "Downtown" },
  { id: "store2", name: "Westside Location", manager: "Emma Johnson", orders: 98, stock: 875, alerts: 1, location: "Westside" },
  { id: "store3", name: "North Mall Store", manager: "Michael Brown", orders: 210, stock: 1650, alerts: 1, location: "North Mall" },
  { id: "store4", name: "East End Dark Store", manager: "Sarah Williams", orders: 65, stock: 920, alerts: 1, location: "East End" },
];

const initialLowStockAlerts: LowStockAlert[] = [
  { id: 1, product: "Organic Milk", store: "Downtown Store", current: 5, minimum: 20, status: "Critical" },
  { id: 2, product: "Premium Coffee", store: "North Mall Store", current: 8, minimum: 15, status: "Low" },
  { id: 3, product: "Whole Wheat Bread", store: "Westside Location", current: 12, minimum: 25, status: "Low" },
  { id: 4, product: "Fresh Chicken", store: "East End Dark Store", current: 3, minimum: 10, status: "Critical" },
  { id: 5, product: "Organic Eggs", store: "Downtown Store", current: 14, minimum: 30, status: "Low" },
];

const initialDeliveries: Delivery[] = [
  { 
    id: "DEL-9231", 
    retailer: "Metro Supermarket", 
    address: "123 Main St, Downtown", 
    driver: "David Lee",
    items: 8, 
    status: "En Route", 
    eta: "10:30 AM",
    pickupLocation: "Downtown Store",
    store: "Downtown Store"
  },
  { 
    id: "DEL-9232", 
    retailer: "Fresh Mart", 
    address: "456 Oak Ave, Westside", 
    driver: "Amanda Clark",
    items: 5, 
    status: "Picked Up", 
    eta: "11:15 AM",
    pickupLocation: "Westside Location",
    store: "Westside Location"
  },
  { 
    id: "DEL-9233", 
    retailer: "Corner Grocers", 
    address: "789 Pine Rd, East End", 
    driver: "",
    items: 12, 
    status: "Preparing", 
    pickupLocation: "East End Dark Store", 
    pickupTime: "11:00 AM",
    store: "East End Dark Store"
  },
  { 
    id: "DEL-9234", 
    retailer: "Organica Foods", 
    address: "567 Maple Dr, North Mall", 
    driver: "",
    items: 7, 
    status: "Preparing", 
    pickupLocation: "North Mall Store", 
    pickupTime: "01:30 PM",
    store: "North Mall Store"
  },
  { 
    id: "DEL-9228", 
    retailer: "Health Foods", 
    address: "234 Cedar Ln, Downtown", 
    driver: "Jennifer White",
    items: 9, 
    status: "Delivered", 
    completedAt: "Yesterday, 4:15 PM",
    store: "Downtown Store"
  },
  { 
    id: "DEL-9229", 
    retailer: "Quick Mart", 
    address: "876 Elm St, Westside", 
    driver: "Robert Johnson",
    items: 6, 
    status: "Delivered", 
    completedAt: "Yesterday, 5:30 PM",
    store: "Westside Location"
  },
  { 
    id: "DEL-9230", 
    retailer: "Grocery Plus", 
    address: "345 Birch Ave, North Mall", 
    driver: "Amanda Clark",
    items: 11, 
    status: "Delivered", 
    completedAt: "Today, 9:45 AM",
    store: "North Mall Store"
  },
];

// Provider component
export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State initialization
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(initialLowStockAlerts);
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Computed properties for statistics
  const inventoryCount = inventory.reduce((sum, item) => sum + item.stock, 0);
  const staffCount = staff.filter(s => s.active).length;
  const orderCount = orders.length;
  const storeCount = stores.length;
  const lowStockCount = lowStockAlerts.length;
  const deliveryCount = deliveries.filter(d => d.status !== "Delivered").length;
  
  // Update low stock alerts based on inventory changes
  useEffect(() => {
    const newAlerts: LowStockAlert[] = [];
    let alertId = 1;
    
    inventory.forEach(item => {
      if (item.stock < item.min) {
        const storeName = stores.find(s => s.id === item.storeId)?.name || item.storeId;
        const status = item.stock < item.min / 2 ? "Critical" : "Low";
        
        newAlerts.push({
          id: alertId++,
          product: item.product,
          store: storeName,
          current: item.stock,
          minimum: item.min,
          status
        });
      }
    });
    
    setLowStockAlerts(newAlerts);
    
    // Update store alert counts
    const updatedStores = stores.map(store => {
      const alertCount = newAlerts.filter(alert => alert.store === store.name).length;
      return { ...store, alerts: alertCount };
    });
    
    setStores(updatedStores);
  }, [inventory]);
  
  // Inventory management functions
  const addInventoryItem = useCallback((item: Omit<InventoryItem, "id" | "status">) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.max(0, ...inventory.map(i => i.id)) + 1,
      status: item.stock < item.min ? (item.stock < item.min / 2 ? "Critical" : "Low") : "OK"
    };
    
    setInventory(prev => [...prev, newItem]);
    
    toast({
      title: "Inventory Updated",
      description: `${item.product} has been added to inventory`
    });
  }, [inventory, toast]);
  
  const updateInventoryItem = useCallback((id: number, updates: Partial<InventoryItem>) => {
    setInventory(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          // Update status based on stock level
          if (updatedItem.stock !== undefined && updatedItem.min !== undefined) {
            updatedItem.status = updatedItem.stock < updatedItem.min 
              ? (updatedItem.stock < updatedItem.min / 2 ? "Critical" : "Low") 
              : "OK";
          }
          return updatedItem;
        }
        return item;
      });
    });
    
    toast({
      title: "Inventory Updated",
      description: `Inventory item has been updated`
    });
  }, [toast]);
  
  const removeInventoryItem = useCallback((id: number) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Inventory Updated",
      description: `Item has been removed from inventory`
    });
  }, [toast]);
  
  // Staff management functions
  const addStaffMember = useCallback((member: Omit<Staff, "id" | "assigned" | "completed" | "active">) => {
    const newMember: Staff = {
      ...member,
      id: Math.max(0, ...staff.map(s => s.id)) + 1,
      assigned: 0,
      completed: 0,
      active: true
    };
    
    setStaff(prev => [...prev, newMember]);
    
    toast({
      title: "Staff Added",
      description: `${member.name} has been added as ${member.role}`
    });
  }, [staff, toast]);
  
  const updateStaffMember = useCallback((id: number, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
    
    toast({
      title: "Staff Updated",
      description: `Staff member information has been updated`
    });
  }, [toast]);
  
  const removeStaffMember = useCallback((id: number) => {
    // Instead of deleting, mark as inactive
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, active: false } : member
    ));
    
    toast({
      title: "Staff Removed",
      description: `Staff member has been removed`
    });
    
    // Reassign any orders
    setOrders(prev => prev.map(order => {
      const staffMember = staff.find(s => s.id === id);
      if (staffMember && order.assigned === staffMember.name) {
        return { ...order, assigned: "", status: "Pending" };
      }
      return order;
    }));
  }, [staff, toast]);
  
  // Order management functions
  const createOrder = useCallback((order: Omit<Order, "id" | "date" | "progress">) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toISOString().split('T')[0];
    
    const newOrder: Order = {
      ...order,
      id: orderId,
      date,
      progress: 0
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Update store order count
    setStores(prev => prev.map(store => 
      store.id === order.storeId 
        ? { ...store, orders: store.orders + 1 } 
        : store
    ));
    
    toast({
      title: "Order Created",
      description: `Order ${orderId} has been created successfully`
    });
    
    return orderId;
  }, [toast]);
  
  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${id} has been updated`
    });
  }, [toast]);
  
  const assignOrder = useCallback((orderId: string, staffName: string) => {
    // Update order
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, assigned: staffName, status: "Assigned" } 
        : order
    ));
    
    // Update staff assignment count
    setStaff(prev => prev.map(member => 
      member.name === staffName 
        ? { ...member, assigned: member.assigned + 1 } 
        : member
    ));
    
    toast({
      title: "Order Assigned",
      description: `Order ${orderId} has been assigned to ${staffName}`
    });
  }, [toast]);
  
  const completeOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Update order status
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: "Ready" } 
        : o
    ));
    
    // Update staff stats
    if (order.assigned) {
      setStaff(prev => prev.map(member => 
        member.name === order.assigned 
          ? { 
              ...member, 
              assigned: Math.max(0, member.assigned - 1),
              completed: member.completed + 1
            } 
          : member
      ));
    }
    
    // Create delivery entry if order is ready
    const storeInfo = stores.find(s => s.id === order.storeId);
    if (storeInfo) {
      const deliveryId = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newDelivery: Delivery = {
        id: deliveryId,
        retailer: order.retailer,
        driver: "",
        store: storeInfo.name,
        status: "Preparing",
        pickupLocation: storeInfo.name,
        pickupTime: "Waiting for pickup",
        items: order.items,
        address: `${order.retailer} Address`
      };
      
      setDeliveries(prev => [...prev, newDelivery]);
    }
    
    toast({
      title: "Order Completed",
      description: `Order ${orderId} has been completed and is ready for delivery`
    });
  }, [orders, stores, toast]);
  
  // Delivery management functions
  const addDelivery = useCallback((delivery: Omit<Delivery, "id">) => {
    const deliveryId = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newDelivery: Delivery = {
      ...delivery,
      id: deliveryId
    };
    
    setDeliveries(prev => [...prev, newDelivery]);
    
    toast({
      title: "Delivery Created",
      description: `Delivery ${deliveryId} has been created`
    });
  }, [toast]);
  
  const updateDelivery = useCallback((id: string, updates: Partial<Delivery>) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === id ? { ...delivery, ...updates } : delivery
    ));
    
    // If delivery is completed, update corresponding order status
    if (updates.status === "Delivered") {
      const delivery = deliveries.find(d => d.id === id);
      if (delivery) {
        // Find order by retailer and update status
        setOrders(prev => prev.map(order => 
          order.retailer === delivery.retailer && order.status === "Ready"
            ? { ...order, status: "Delivered" }
            : order
        ));
      }
    }
    
    toast({
      title: "Delivery Updated",
      description: `Delivery ${id} has been updated`
    });
  }, [deliveries, toast]);
  
  // Cart management functions
  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
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
      description: `${product.name} added to your order`
    });
  }, [toast]);
  
  const updateCartItem = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
    
    toast({
      title: "Cart updated",
      description: `Cart has been updated`
    });
  }, [toast]);
  
  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: `Item has been removed from your cart`
    });
  }, [toast]);
  
  const clearCart = useCallback(() => {
    setCart([]);
    
    toast({
      title: "Cart cleared",
      description: `All items have been removed from your cart`
    });
  }, [toast]);
  
  const placeOrder = useCallback(() => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart first",
        variant: "destructive",
      });
      return;
    }
    
    // Create new order
    const retailerName = user?.name || "Guest Retailer";
    const storeId = "store1"; // Default to first store
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderId = createOrder({
      retailer: retailerName,
      items: totalItems,
      value: totalValue,
      status: "Pending",
      assigned: "",
      storeId,
      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        picked: false,
        price: item.price
      }))
    });
    
    // Update inventory
    cart.forEach(item => {
      const inventoryItem = inventory.find(i => i.id === item.id && i.storeId === storeId);
      if (inventoryItem) {
        updateInventoryItem(inventoryItem.id, { 
          stock: Math.max(0, inventoryItem.stock - item.quantity) 
        });
      }
    });
    
    // Clear cart
    setCart([]);
    
    toast({
      title: "Order placed successfully",
      description: `Your order ${orderId} with ${totalItems} items has been placed`,
    });
  }, [cart, user, inventory, createOrder, updateInventoryItem, toast]);
  
  // Filter helper functions
  const getStoreInventory = useCallback((storeId: string) => {
    return inventory.filter(item => item.storeId === storeId);
  }, [inventory]);
  
  const getStoreStaff = useCallback((storeId: string) => {
    return staff.filter(member => member.storeId === storeId && member.active);
  }, [staff]);
  
  const getStoreOrders = useCallback((storeId: string) => {
    return orders.filter(order => order.storeId === storeId);
  }, [orders]);
  
  const getAssignedOrders = useCallback((staffName: string) => {
    return orders.filter(order => order.assigned === staffName);
  }, [orders]);
  
  const getPendingOrders = useCallback(() => {
    return orders.filter(order => 
      ["Pending", "Assigned", "Picking", "Packing"].includes(order.status)
    );
  }, [orders]);
  
  const getActiveDeliveries = useCallback(() => {
    return deliveries.filter(delivery => 
      ["En Route", "Picked Up"].includes(delivery.status)
    );
  }, [deliveries]);
  
  const getUpcomingDeliveries = useCallback(() => {
    return deliveries.filter(delivery => delivery.status === "Preparing");
  }, [deliveries]);
  
  const getCompletedDeliveries = useCallback(() => {
    return deliveries.filter(delivery => delivery.status === "Delivered");
  }, [deliveries]);
  
  // Stock management
  const requestRestock = useCallback((productId: number) => {
    const product = inventory.find(item => item.id === productId);
    if (!product) return;
    
    updateInventoryItem(productId, { 
      stock: product.stock + Math.ceil(product.min * 1.5) 
    });
    
    toast({
      title: "Restock requested",
      description: `Restock request for ${product.product} has been processed`
    });
  }, [inventory, updateInventoryItem, toast]);
  
  return (
    <WarehouseContext.Provider
      value={{
        // Data collections
        inventory,
        staff,
        orders,
        stores,
        lowStockAlerts,
        deliveries,
        cart,
        
        // Counts for dashboard stats
        inventoryCount,
        staffCount,
        orderCount,
        storeCount,
        lowStockCount,
        deliveryCount,
        
        // Action functions
        addInventoryItem,
        updateInventoryItem,
        removeInventoryItem,
        
        addStaffMember,
        updateStaffMember,
        removeStaffMember,
        
        createOrder,
        updateOrder,
        assignOrder,
        completeOrder,
        
        addDelivery,
        updateDelivery,
        
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        placeOrder,
        
        // Filter helpers
        getStoreInventory,
        getStoreStaff,
        getStoreOrders,
        getAssignedOrders,
        getPendingOrders,
        getActiveDeliveries,
        getUpcomingDeliveries,
        getCompletedDeliveries,
        
        // Stock management
        requestRestock,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

// Custom hook to use warehouse context
export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error("useWarehouse must be used within a WarehouseProvider");
  }
  return context;
};
