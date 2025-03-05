
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Dark Store Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
          Streamline your dark store operations with our comprehensive management solution
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-card rounded-lg shadow-lg animate-slide-up">
            <h3 className="text-xl font-semibold mb-3">Inventory Management</h3>
            <p className="text-muted-foreground">Real-time stock tracking and automated replenishment</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-xl font-semibold mb-3">Order Fulfillment</h3>
            <p className="text-muted-foreground">Streamlined picking, packing, and delivery coordination</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-muted-foreground">Data-driven insights to optimize operations</p>
          </div>
        </div>
        <Button 
          size="lg" 
          className="animate-pulse hover:animate-none"
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
