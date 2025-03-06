
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to the StockPulse System",
      });
      
      // Navigation happens in the protected route
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  // Demo login details
  const demoUsers = [
    { role: "Admin", email: "admin@example.com" },
    { role: "Store Manager", email: "manager@example.com" },
    { role: "Warehouse Staff", email: "staff@example.com" },
    { role: "Delivery Partner", email: "delivery@example.com" },
    { role: "Retailer", email: "retailer@example.com" },
  ];

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
    
    try {
      await login(demoEmail, "password");
      
      toast({
        title: "Demo login successful",
        description: "Logged in with demo account",
      });
      
      // Navigation happens in the protected route
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <Card className="p-6 shadow-lg border-opacity-30">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the management system
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Demo Accounts
              </span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-2">
            {demoUsers.map((user) => (
              <Button
                key={user.email}
                variant="outline"
                type="button"
                onClick={() => handleDemoLogin(user.email)}
                disabled={isLoading}
                className="text-xs h-8"
              >
                Login as {user.role}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
