import { type InventoryItem, type Order } from './types';

export const mockInventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Heavy Machinery Parts', quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20' },
  { id: 'ITM-002', name: 'Electronics Components', quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21' },
  { id: 'ITM-003', name: 'Medical Supplies', quantity: 0, status: 'Outbound', lastUpdated: '2024-05-22' },
  { id: 'ITM-004', name: 'Consumer Goods', quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23' },
  { id: 'ITM-005', name: 'Automotive Spares', quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19' },
];

export const mockOrders: Order[] = [
  { 
    id: 'ORD-101', 
    customerName: 'Global Imports', 
    item: 'ITM-003', 
    status: 'Delivered', 
    pickup: { address: 'Warehouse A, Long Beach, CA', coords: { lat: 33.7701, lng: -118.1937 } },
    destination: { address: '123 Market St, Los Angeles, CA', coords: { lat: 34.0522, lng: -118.2437 } },
    orderDate: '2024-05-22',
    currentLocation: { lat: 34.0522, lng: -118.2437 } 
  },
  { 
    id: 'ORD-102', 
    customerName: 'Tech Solutions Inc.', 
    item: 'ITM-002 (x20)', 
    status: 'In Transit', 
    pickup: { address: 'Warehouse B, San Francisco, CA', coords: { lat: 37.7749, lng: -122.4194 } },
    destination: { address: '456 Tech Park, San Jose, CA', coords: { lat: 37.3382, lng: -121.8863 } },
    orderDate: '2024-05-23',
    currentLocation: { lat: 37.55, lng: -122.15 }
  },
  { 
    id: 'ORD-103', 
    customerName: 'Build-It Co.', 
    item: 'ITM-001 (x5)', 
    status: 'Pending', 
    pickup: { address: 'Warehouse A, Long Beach, CA', coords: { lat: 33.7701, lng: -118.1937 } },
    destination: { address: '789 Industrial Ave, San Diego, CA', coords: { lat: 32.7157, lng: -117.1611 } },
    orderDate: '2024-05-24',
    currentLocation: null
  },
  { 
    id: 'ORD-104', 
    customerName: 'Jane Doe', 
    item: 'Custom Item', 
    status: 'In Transit', 
    pickup: { address: '555 Pine Ln, Portland, OR', coords: { lat: 45.5051, lng: -122.6750 } },
    destination: { address: '888 Oak Rd, Seattle, WA', coords: { lat: 47.6062, lng: -122.3321 } },
    orderDate: '2024-05-24',
    currentLocation: { lat: 46.5, lng: -122.5 }
  },
  { 
    id: 'ORD-105', 
    customerName: 'City Hospital', 
    item: 'ITM-003 (x50)', 
    status: 'Cancelled', 
    pickup: { address: 'Warehouse C, Phoenix, AZ', coords: { lat: 33.4484, lng: -112.0740 } },
    destination: { address: '999 Health Blvd, Phoenix, AZ', coords: { lat: 33.45, lng: -112.09 } },
    orderDate: '2024-05-21',
    currentLocation: null
  },
];
