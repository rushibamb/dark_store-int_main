
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WarehouseProvider } from "@/contexts/WarehouseContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Create placeholder pages for all sidebar menu items
const Inventory = () => <div className="p-6"><h1 className="text-3xl font-bold">Inventory Management</h1><p className="mt-4">This page is under development</p></div>;
const Orders = () => <div className="p-6"><h1 className="text-3xl font-bold">Orders</h1><p className="mt-4">This page is under development</p></div>;
const Warehouses = () => <div className="p-6"><h1 className="text-3xl font-bold">Warehouses</h1><p className="mt-4">This page is under development</p></div>;
const Staff = () => <div className="p-6"><h1 className="text-3xl font-bold">Staff Management</h1><p className="mt-4">This page is under development</p></div>;
const Deliveries = () => <div className="p-6"><h1 className="text-3xl font-bold">Deliveries</h1><p className="mt-4">This page is under development</p></div>;
const Products = () => <div className="p-6"><h1 className="text-3xl font-bold">Products</h1><p className="mt-4">This page is under development</p></div>;
const Tasks = () => <div className="p-6"><h1 className="text-3xl font-bold">Tasks</h1><p className="mt-4">This page is under development</p></div>;
const Reports = () => <div className="p-6"><h1 className="text-3xl font-bold">Reports</h1><p className="mt-4">This page is under development</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-4">This page is under development</p></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <WarehouseProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Inventory routes */}
              <Route path="/inventory" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager", "warehouse_staff"]}>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              {/* Orders routes */}
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager", "warehouse_staff", "delivery_partner", "retailer"]}>
                  <Orders />
                </ProtectedRoute>
              } />
              
              {/* Warehouses routes */}
              <Route path="/warehouses" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager"]}>
                  <Warehouses />
                </ProtectedRoute>
              } />
              
              {/* Staff routes */}
              <Route path="/staff" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager"]}>
                  <Staff />
                </ProtectedRoute>
              } />
              
              {/* Deliveries routes */}
              <Route path="/deliveries" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager", "delivery_partner"]}>
                  <Deliveries />
                </ProtectedRoute>
              } />
              
              {/* Products routes */}
              <Route path="/products" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager", "retailer"]}>
                  <Products />
                </ProtectedRoute>
              } />
              
              {/* Tasks routes */}
              <Route path="/tasks" element={
                <ProtectedRoute allowedRoles={["warehouse_staff", "delivery_partner"]}>
                  <Tasks />
                </ProtectedRoute>
              } />
              
              {/* Reports routes */}
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={["admin", "store_manager"]}>
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* Settings routes */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Unauthorized and Not Found routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </WarehouseProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
