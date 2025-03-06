import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/pages/dashboards/WarehouseStaffDashboard'; // Correct the import path

interface InventoryContextProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch inventory data from an API or other data source
    const fetchInventoryData = async () => {
      // Replace with your data fetching logic
      const data: Order[] = await fetch('/api/inventory').then(res => res.json());
      setOrders(data);
    };

    fetchInventoryData();
  }, []);

  return (
    <InventoryContext.Provider value={{ orders, setOrders }}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};