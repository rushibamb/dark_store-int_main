import React, { useState } from 'react';

interface Order {
  id: string;
  retailer: string;
  status: "Pending" | "Picked" | "Packing" | "Completed";
  products: {
    id: number;
    name: string;
    quantity: number;
    picked: boolean;
  }[];
  progress: number;
  category: string; // Add category field
}

interface OrdersProps {
  orders: Order[];
  onAddOrder: (newOrder: Order) => void;
  onRemoveOrder: (orderId: string) => void;
  onUpdateOrder: (orderId: string, updatedProducts: Order['products']) => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, onAddOrder, onRemoveOrder, onUpdateOrder, onStatusChange }) => {
  const addOrder = (newOrder: Order) => {
    onAddOrder(newOrder);
  };

  const removeOrder = (orderId: string) => {
    onRemoveOrder(orderId);
  };

  const updateOrder = (orderId: string, updatedProducts: Order['products']) => {
    onUpdateOrder(orderId, updatedProducts);
  };

  const changeStatus = (orderId: string, newStatus: Order['status']) => {
    onStatusChange(orderId, newStatus);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="mt-4">Manage your orders here.</p>
      
      <AddOrder onAdd={addOrder} />
      <OrderList orders={orders} onRemove={removeOrder} onUpdate={updateOrder} onStatusChange={changeStatus} />
    </div>
  );
};

const AddOrder: React.FC<{ onAdd: (order: Order) => void }> = ({ onAdd }) => {
  const [products, setProducts] = useState<string>('');
  const [category, setCategory] = useState<string>('Electronics'); // Default category

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      retailer: 'Retailer Name',
      status: 'Pending',
      products: products.split(',').map((product, index) => ({
        id: index,
        name: product.trim(),
        quantity: 1,
        picked: false
      })),
      progress: 0,
      category: category // Include category in the new order
    };
    onAdd(newOrder);
    setProducts('');
    setCategory('Electronics'); // Reset category to default
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={products}
        onChange={(e) => setProducts(e.target.value)}
        placeholder="Enter products separated by commas"
        className="p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="ml-2 p-2 border rounded"
      >
        <option value="Electronics">Electronics</option>
        <option value="Toys">Toys</option>
        <option value="Grocery">Grocery</option>
        <option value="Clothing">Clothing</option>
      </select>
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Add Order</button>
    </form>
  );
};

const OrderList: React.FC<{ orders: Order[], onRemove: (orderId: string) => void, onUpdate: (orderId: string, products: Order['products']) => void, onStatusChange: (orderId: string, newStatus: Order['status']) => void }> = ({ orders, onRemove, onUpdate, onStatusChange }) => {
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [updatedProducts, setUpdatedProducts] = useState<string>('');

  const handleUpdate = (orderId: string) => {
    onUpdate(orderId, updatedProducts.split(',').map((product, index) => ({
      id: index,
      name: product.trim(),
      quantity: 1,
      picked: false
    })));
    setEditingOrderId(null);
    setUpdatedProducts('');
  };

  return (
    <ul className="mt-4">
      {orders.map(order => (
        <li key={order.id} className="mb-2 p-2 border rounded">
          {order.id} - {order.retailer} - {order.products.map(product => product.name).join(', ')} - {order.status} - {order.category}
          <button onClick={() => onRemove(order.id)} className="ml-2 p-1 bg-red-500 text-white rounded">Remove</button>
          {editingOrderId === order.id ? (
            <div className="mt-2">
              <input
                type="text"
                value={updatedProducts}
                onChange={(e) => setUpdatedProducts(e.target.value)}
                placeholder="Update products separated by commas"
                className="p-2 border rounded"
              />
              <button onClick={() => handleUpdate(order.id)} className="ml-2 p-1 bg-green-500 text-white rounded">Save</button>
            </div>
          ) : (
            <button onClick={() => setEditingOrderId(order.id)} className="ml-2 p-1 bg-yellow-500 text-white rounded">Edit</button>
          )}
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
            className="ml-2 p-1 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Picked">Picked</option>
            <option value="Packing">Packing</option>
            <option value="Completed">Completed</option>
          </select>
        </li>
      ))}
    </ul>
  );
};

export default Orders;