import { type InventoryItem, type Order } from './types';

export const mockInventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Cocoa Beans (Grade A)', quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20' },
  { id: 'ITM-002', name: 'Kente Cloth Rolls', quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21' },
  { id: 'ITM-003', name: 'Shea Butter Tubs', quantity: 0, status: 'Outbound', lastUpdated: '2024-05-22' },
  { id: 'ITM-004', name: 'Imported Electronics', quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23' },
  { id: 'ITM-005', name: 'Vehicle Spare Parts', quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19' },
];

export const mockOrders: Order[] = [
  { 
    id: 'ORD-101', 
    customerName: 'Accra Retail Co.', 
    item: 'ITM-003', 
    status: 'Delivered', 
    pickup: { address: 'Tema Port, Tema', coords: { lat: 5.6358, lng: 0.0101 } },
    destination: { address: 'Makola Market, Accra', coords: { lat: 5.5560, lng: -0.2057 } },
    orderDate: '2024-05-22',
    currentLocation: { lat: 5.5560, lng: -0.2057 } 
  },
  { 
    id: 'ORD-102', 
    customerName: 'Kumasi Weavers', 
    item: 'ITM-002 (x20)', 
    status: 'In Transit', 
    pickup: { address: 'Adum, Kumasi', coords: { lat: 6.6886, lng: -1.6244 } },
    destination: { address: 'Takoradi Market Circle, Takoradi', coords: { lat: 4.9048, lng: -1.7553 } },
    orderDate: '2024-05-23',
    currentLocation: { lat: 5.8, lng: -1.69 }
  },
  { 
    id: 'ORD-103', 
    customerName: 'Northern Farmers', 
    item: 'ITM-001 (x5)', 
    status: 'Pending', 
    pickup: { address: 'Tamale Central, Tamale', coords: { lat: 9.4074, lng: -0.8537 } },
    destination: { address: 'Tema Port, Tema', coords: { lat: 5.6358, lng: 0.0101 } },
    orderDate: '2024-05-24',
    currentLocation: null
  },
  { 
    id: 'ORD-104', 
    customerName: 'Cape Coast Tourism', 
    item: 'Custom Item', 
    status: 'In Transit', 
    pickup: { address: 'Kotokuraba Market, Cape Coast', coords: { lat: 5.1054, lng: -1.2466 } },
    destination: { address: 'Kakum National Park, Central Region', coords: { lat: 5.3524, lng: -1.3855 } },
    orderDate: '2024-05-24',
    currentLocation: { lat: 5.22, lng: -1.30 }
  },
  { 
    id: 'ORD-105', 
    customerName: 'City Hospital', 
    item: 'ITM-003 (x50)', 
    status: 'Cancelled', 
    pickup: { address: 'Warehouse C, Accra', coords: { lat: 5.6037, lng: -0.1870 } },
    destination: { address: 'Korle Bu Teaching Hospital, Accra', coords: { lat: 5.5420, lng: -0.2225 } },
    orderDate: '2024-05-21',
    currentLocation: null
  },
];
