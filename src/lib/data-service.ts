
'use server';

import { type InventoryItem, type Order } from './types';

// In-memory data stores to simulate a database
let inventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Cocoa Beans (Grade A)', quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20' },
  { id: 'ITM-002', name: 'Kente Cloth Rolls', quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21' },
  { id: 'ITM-003', name: 'Shea Butter Tubs', quantity: 0, status: 'Outbound', lastUpdated: '2024-05-22' },
  { id: 'ITM-004', name: 'Imported Electronics', quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23' },
  { id: 'ITM-005', name: 'Vehicle Spare Parts', quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19' },
];

let orders: Order[] = [];

// Initialize with some mock orders if the list is empty
const ghanaLocations = {
    "Accra": { lat: 5.6037, lng: -0.1870 },
    "Kumasi": { lat: 6.6886, lng: -1.6244 },
    "Takoradi": { lat: 4.9048, lng: -1.7553 },
    "Tamale": { lat: 9.4074, lng: -0.8537 },
    "Tema": { lat: 5.6667, lng: -0.0167 },
    "Cape Coast": { lat: 5.1054, lng: -1.2466 },
};
const locationNames = Object.keys(ghanaLocations);
const getRandomLocation = () => {
  const name = locationNames[Math.floor(Math.random() * locationNames.length)];
  return { address: name, coords: ghanaLocations[name as keyof typeof ghanaLocations] };
};

const routeColors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
  '#33FFA1', '#FFC300', '#C70039', '#900C3F', '#581845'
];

if (orders.length === 0) {
    orders = Array.from({ length: 5 }, (_, i) => {
        const id = `ORD-${101 + i}`;
        const pickup = getRandomLocation();
        let destination = getRandomLocation();
        while (destination.address === pickup.address) {
            destination = getRandomLocation();
        }
        const status: Order['status'] = 'Moving';
        const paymentStatus: Order['paymentStatus'] = 'Paid';
        const currentLocation = {
            lat: pickup.coords.lat + (destination.coords.lat - pickup.coords.lat) * Math.random(),
            lng: pickup.coords.lng + (destination.coords.lng - pickup.coords.lng) * Math.random(),
        };

        return {
            id,
            customerName: `Customer ${101 + i}`,
            item: `ITM-00${(i % 5) + 1}`,
            status,
            paymentStatus,
            pickup,
            destination,
            orderDate: `2024-05-${20 + (i % 10)}`,
            currentLocation,
            routeColor: routeColors[i % routeColors.length]
        };
    });
}


// Functions to interact with the data

// == INVENTORY ==
export async function getInventory(): Promise<InventoryItem[]> {
  return Promise.resolve(inventory);
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>): Promise<InventoryItem> {
  const newId = `ITM-${String(inventory.length + 1).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const newItem: InventoryItem = {
    ...item,
    id: newId,
    status: 'In Stock',
    lastUpdated: today,
  };
  inventory = [...inventory, newItem];
  return Promise.resolve(newItem);
}

// == ORDERS ==
export async function getOrders(): Promise<Order[]> {
  return Promise.resolve(orders);
}

export async function addOrder(newOrderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
    const newId = `ORD-${String(101 + orders.length)}`;
    const today = new Date().toISOString().split('T')[0];
    const newOrder: Order = {
        ...newOrderData,
        id: newId,
        orderDate: today,
        status: 'Pending', // All new orders start as pending
    };
    orders = [newOrder, ...orders];
    return Promise.resolve(newOrder);
}

export async function updateOrder(updatedOrder: Order): Promise<Order> {
    orders = orders.map(order => order.id === updatedOrder.id ? updatedOrder : order);
    return Promise.resolve(updatedOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    return Promise.resolve(orders.find(order => order.id === id));
}

// Function to simulate truck movement for the admin map
export async function updateTruckLocations(): Promise<Order[]> {
    orders = orders.map(order => {
        if ((order.status === 'Moving' || order.status === 'Returning') && order.currentLocation) {
            const destination = order.status === 'Returning' ? order.pickup.coords : order.destination.coords;
            const speed = 0.01; // Simulation speed
            
            const latDiff = destination.lat - order.currentLocation.lat;
            const lngDiff = destination.lng - order.currentLocation.lng;
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

            if (distance < speed) {
                return { 
                    ...order, 
                    currentLocation: destination, 
                    status: order.status === 'Moving' ? 'Delivered' : 'Idle' 
                };
            }

            const newLat = order.currentLocation.lat + (latDiff / distance) * speed;
            const newLng = order.currentLocation.lng + (lngDiff / distance) * speed;
            
            return { ...order, currentLocation: { lat: newLat, lng: newLng } };
        }
        return order;
    });
    return Promise.resolve(orders);
}
