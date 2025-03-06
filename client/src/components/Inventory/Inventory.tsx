import React from 'react';
import { Order } from "@/pages/dashboards/WarehouseStaffDashboard"; // Correct the import path

interface ProductInventory {
  name: string;
  category: string;
  stock: number;
  location: string;
}

interface InventoryProps {
  orders: Order[];
}

// Replicate warehouse zones data from WarehouseMap component
const warehouseZones = [
  { id: "A1", status: "active", category: "Electronics", fills: 92 },
  { id: "A2", status: "active", category: "Clothing", fills: 76 },
  { id: "A3", status: "active", category: "Home Goods", fills: 85 },
  { id: "A4", status: "active", category: "Toys", fills: 42 },
  { id: "B1", status: "active", category: "Kitchen", fills: 87 },
  { id: "B2", status: "maintenance", category: "Furniture", fills: 15 },
  { id: "B3", status: "active", category: "Books", fills: 53 },
];

const Inventory: React.FC<InventoryProps> = ({ orders }) => {
  // Aggregate inventory from non-completed orders
  const inventory: { [key: string]: ProductInventory } = {};

  orders.forEach(order => {
    // Only include orders that are not completed
    if (order.status !== "Completed") {
      order.products.forEach(product => {
        if (!inventory[product.name]) {
          // Find location based on product category
          const zone = warehouseZones.find(z => z.category === order.category);
          inventory[product.name] = {
            name: product.name,
            category: order.category,
            stock: 0,
            location: zone ? zone.id : "N/A"
          };
        }
        inventory[product.name].stock += product.quantity;
      });
    }
  });

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Level</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.values(inventory).map(product => (
              <tr key={product.name}>
                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.location}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{product.stock} units</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;