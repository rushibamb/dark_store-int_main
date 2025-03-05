
import React, { createContext, useContext, useState, useEffect } from "react";

// User roles
export type UserRole = "admin" | "store_manager" | "warehouse_staff" | "delivery_partner" | "retailer";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string; // For store managers and warehouse staff
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app this would come from API
const MOCK_USERS: User[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "2", name: "Store Manager", email: "manager@example.com", role: "store_manager", storeId: "store1" },
  { id: "3", name: "Warehouse Staff", email: "staff@example.com", role: "warehouse_staff", storeId: "store1" },
  { id: "4", name: "Delivery Partner", email: "delivery@example.com", role: "delivery_partner" },
  { id: "5", name: "Retailer", email: "retailer@example.com", role: "retailer" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);
  
  // Login function - in a real app this would call an API
  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password !== "password") {
        throw new Error("Invalid email or password");
      }
      
      if (role) {
        // Create a custom user with the selected role
        const customUser: User = {
          id: `custom-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role,
        };
        localStorage.setItem("user", JSON.stringify(customUser));
        setUser(customUser);
      } else {
        // Find user by email (mock authentication)
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        if (foundUser) {
          localStorage.setItem("user", JSON.stringify(foundUser));
          setUser(foundUser);
        } else {
          throw new Error("Invalid email or password");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
