
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart4,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Menu items based on user role
  const menuItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin", "store_manager", "warehouse_staff", "delivery_partner", "retailer"],
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />,
      roles: ["admin", "store_manager", "warehouse_staff"],
    },
    {
      title: "Orders",
      href: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      roles: ["admin", "store_manager", "warehouse_staff", "delivery_partner", "retailer"],
    },
    {
      title: "Warehouses",
      href: "/warehouses",
      icon: <Store className="h-5 w-5" />,
      roles: ["admin", "store_manager"],
    },
    {
      title: "Staff",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin", "store_manager"],
    },
    {
      title: "Deliveries",
      href: "/deliveries",
      icon: <Truck className="h-5 w-5" />,
      roles: ["admin", "store_manager", "delivery_partner"],
    },
    {
      title: "Products",
      href: "/products",
      icon: <Box className="h-5 w-5" />,
      roles: ["admin", "store_manager", "retailer"],
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["warehouse_staff", "delivery_partner"],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart4 className="h-5 w-5" />,
      roles: ["admin", "store_manager"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin", "store_manager", "warehouse_staff", "delivery_partner", "retailer"],
    },
  ];

  // Filter items by user role
  const filteredItems = menuItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex h-14 items-center px-3 border-b border-sidebar-border">
        <div className="flex items-center">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="h-5 w-5 text-sidebar-primary" />
              <span className="font-medium">Stock Pulse</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="flex justify-center w-full">
              <Home className="h-5 w-5 text-sidebar-primary" />
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn(
            "ml-auto h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "rotate-180"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href ||
                  (item.href !== "/dashboard" && location.pathname.startsWith(item.href))
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="mt-auto p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
