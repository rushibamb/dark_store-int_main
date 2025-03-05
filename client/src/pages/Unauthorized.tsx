
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <XCircle className="h-16 w-16 mx-auto text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
