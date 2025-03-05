import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import { DataTable } from "@/components/common/DataTable";
import Stats from "@/components/common/Stats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Package,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const mockActiveDeliveries = [
  { 
    id: "DEL-9231", 
    retailer: "Metro Supermarket", 
    address: "123 Main St, Downtown", 
    items: 8, 
    status: "En Route", 
    eta: "10:30 AM",
    pickupLocation: "Downtown Store"
  },
  { 
    id: "DEL-9232", 
    retailer: "Fresh Mart", 
    address: "456 Oak Ave, Westside", 
    items: 5, 
    status: "Picked Up", 
    eta: "11:15 AM",
    pickupLocation: "Westside Location"
  }
];

const mockUpcomingDeliveries = [
  { id: "DEL-9233", retailer: "Corner Grocers", address: "789 Pine Rd, East End", items: 12, pickupLocation: "East End Dark Store", pickupTime: "11:00 AM" },
  { id: "DEL-9234", retailer: "Organica Foods", address: "567 Maple Dr, North Mall", items: 7, pickupLocation: "North Mall Store", pickupTime: "01:30 PM" },
];

const mockCompletedDeliveries = [
  { id: "DEL-9228", retailer: "Health Foods", address: "234 Cedar Ln, Downtown", items: 9, completedAt: "Yesterday, 4:15 PM" },
  { id: "DEL-9229", retailer: "Quick Mart", address: "876 Elm St, Westside", items: 6, completedAt: "Yesterday, 5:30 PM" },
  { id: "DEL-9230", retailer: "Grocery Plus", address: "345 Birch Ave, North Mall", items: 11, completedAt: "Today, 9:45 AM" },
];

const DeliveryPartnerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDeliveries, setActiveDeliveries] = useState(mockActiveDeliveries);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState(mockUpcomingDeliveries);
  
  const handleStartDelivery = (delivery: any) => {
    const updated = upcomingDeliveries.filter(d => d.id !== delivery.id);
    setUpcomingDeliveries(updated);
    
    const newActive = [...activeDeliveries, {
      ...delivery, 
      status: "Picked Up",
      eta: "Calculating..."
    }];
    setActiveDeliveries(newActive);
    
    toast({
      title: "Delivery started",
      description: `You've picked up order ${delivery.id} from ${delivery.pickupLocation}`,
    });
  };
  
  const handleDeliveryUpdate = (deliveryId: string, newStatus: string) => {
    const updated = activeDeliveries.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
    );
    
    if (newStatus === "Delivered") {
      const completed = updated.filter(d => d.id !== deliveryId);
      setActiveDeliveries(completed);
      
      toast({
        title: "Delivery completed",
        description: `Order ${deliveryId} has been successfully delivered`,
        variant: "default",
      });
    } else {
      setActiveDeliveries(updated);
      
      toast({
        title: "Status updated",
        description: `Order ${deliveryId} is now ${newStatus}`,
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Delivery Partner Dashboard</h1>
        <h2 className="text-xl text-muted-foreground mb-6">
          {user?.name ? `Welcome, ${user.name}` : "Delivery Operations"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stats 
            title="Active Deliveries" 
            value={activeDeliveries.length.toString()} 
            description="In progress" 
            icon={<Truck className="h-8 w-8 text-info" />} 
          />
          <Stats 
            title="Upcoming Pickups" 
            value={upcomingDeliveries.length.toString()} 
            description="Scheduled today" 
            icon={<Clock className="h-8 w-8 text-warning" />} 
          />
          <Stats 
            title="Completed Today" 
            value="3" 
            description="Successful deliveries" 
            icon={<CheckCircle2 className="h-8 w-8 text-success" />} 
          />
          <Stats 
            title="Total Items" 
            value="39" 
            description="Products delivered" 
            icon={<Package className="h-8 w-8 text-primary" />} 
          />
        </div>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Pickups</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card title="Active Deliveries" description="Orders you're currently delivering">
              {activeDeliveries.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Deliveries</h3>
                  <p className="text-muted-foreground">
                    You don't have any active deliveries at the moment. Check the upcoming tab for scheduled pickups.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeDeliveries.map(delivery => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{delivery.id}</h3>
                          <p className="text-muted-foreground">{delivery.retailer}</p>
                          <div className="flex items-center mt-1 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {delivery.address}
                          </div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            delivery.status === "En Route" 
                              ? "bg-info text-info-foreground" 
                              : "bg-warning text-warning-foreground"
                          }`}>
                            {delivery.status}
                          </span>
                          <div className="text-sm mt-2 text-right">
                            <span className="text-muted-foreground">ETA:</span> {delivery.eta}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {delivery.status === "Picked Up" && (
                          <Button className="flex-1" onClick={() => handleDeliveryUpdate(delivery.id, "En Route")}>
                            <Navigation className="h-4 w-4 mr-2" />
                            Start Navigation
                          </Button>
                        )}
                        
                        {delivery.status === "En Route" && (
                          <Button className="flex-1" onClick={() => handleDeliveryUpdate(delivery.id, "Delivered")}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Delivered
                          </Button>
                        )}
                        
                        <Button variant="outline" className="flex-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Map
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card title="Upcoming Pickups" description="Orders ready for pickup">
              <DataTable 
                data={upcomingDeliveries} 
                columns={[
                  { key: "id", title: "Order ID" },
                  { key: "retailer", title: "Retailer" },
                  { key: "pickupLocation", title: "Pickup Location" },
                  { key: "pickupTime", title: "Pickup Time" },
                  { key: "items", title: "Items" },
                  { 
                    key: "id", 
                    title: "Action", 
                    render: (value, row) => (
                      <Button size="sm" onClick={() => handleStartDelivery(row)}>
                        Start Pickup
                      </Button>
                    )
                  },
                ]}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card title="Completed Deliveries" description="Your recent delivery history">
              <DataTable 
                data={mockCompletedDeliveries} 
                columns={[
                  { key: "id", title: "Order ID" },
                  { key: "retailer", title: "Retailer" },
                  { key: "address", title: "Delivery Address" },
                  { key: "items", title: "Items" },
                  { key: "completedAt", title: "Completed At" },
                ]}
              />
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card title="Weekly Schedule" description="Your delivery assignments">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schedule Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on a new scheduling feature that will allow you to view and manage your delivery assignments for the entire week.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryPartnerDashboard;
