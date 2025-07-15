import { type InventoryItem, type Order } from './types';

export const mockInventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Heavy Machinery Parts', quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20' },
  { id: 'ITM-002', name: 'Electronics Components', quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21' },
  { id: 'ITM-003', name: 'Medical Supplies', quantity: 0, status: 'Outbound', lastUpdated: '2024-05-22' },
  { id: 'ITM-004', name: 'Consumer Goods', quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23' },
  { id: 'ITM-005', name: 'Automotive Spares', quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19' },
];

export const mockOrders: Order[] = [
  { id: 'ORD-101', customerName: 'Global Imports', item: 'ITM-003', status: 'Delivered', pickup: 'Warehouse A', destination: '123 Market St', orderDate: '2024-05-22' },
  { id: 'ORD-102', customerName: 'Tech Solutions Inc.', item: 'ITM-002 (x20)', status: 'In Transit', pickup: 'Warehouse B', destination: '456 Tech Park', orderDate: '2024-05-23' },
  { id: 'ORD-103', customerName: 'Build-It Co.', item: 'ITM-001 (x5)', status: 'Pending', pickup: 'Warehouse A', destination: '789 Industrial Ave', orderDate: '2024-05-24' },
  { id: 'ORD-104', customerName: 'Jane Doe', item: 'Custom Item', status: 'In Transit', pickup: '555 Pine Ln', destination: '888 Oak Rd', orderDate: '2024-05-24' },
  { id: 'ORD-105', customerName: 'City Hospital', item: 'ITM-003 (x50)', status: 'Cancelled', pickup: 'Warehouse A', destination: '999 Health Blvd', orderDate: '2024-05-21' },
];
