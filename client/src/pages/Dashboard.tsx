
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import StoreManagerDashboard from "@/pages/dashboards/StoreManagerDashboard";
import WarehouseStaffDashboard from "@/pages/dashboards/WarehouseStaffDashboard";
import DeliveryPartnerDashboard from "@/pages/dashboards/DeliveryPartnerDashboard";
import RetailerDashboard from "@/pages/dashboards/RetailerDashboard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      toast({
        title: `Welcome, ${user.name}`,
        description: `You are logged in as ${user.role.replace('_', ' ')}`,
      });
    }
  }, [user]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "store_manager":
      return <StoreManagerDashboard />;
    case "warehouse_staff":
      return <WarehouseStaffDashboard />;
    case "delivery_partner":
      return <DeliveryPartnerDashboard />;
    case "retailer":
      return <RetailerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
