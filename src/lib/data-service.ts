
'use server';

import { type InventoryItem, type Order, type Customer, type Driver } from './types';

// In-memory data stores to simulate a database
let inventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Cocoa Beans (Grade A)', category: "Produce", quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20', unitCost: 12.50, minThreshold: 20 },
  { id: 'ITM-002', name: 'Kente Cloth Rolls', category: "Textiles", quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21', unitCost: 75.00, minThreshold: 50 },
  { id: 'ITM-003', name: 'Shea Butter Tubs', category: "Cosmetics", quantity: 15, status: 'Low Stock', lastUpdated: '2024-05-22', unitCost: 25.00, minThreshold: 20 },
  { id: 'ITM-004', name: 'Imported Electronics', category: "Electronics", quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23', unitCost: 150.00, minThreshold: 30 },
  { id: 'ITM-005', name: 'Vehicle Spare Parts', category: "Automotive", quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19', unitCost: 55.00, minThreshold: 40 },
  { id: 'ITM-006', name: 'Tomato Paste (400g)', category: "FMCG", quantity: 850, status: 'In Stock', lastUpdated: '2024-05-24', unitCost: 4.50, minThreshold: 200 },
];

let orders: Order[] = [];
let customers: Customer[] = [];
let drivers: Driver[] = [];


// Initialize with some mock data if the lists are empty
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
  '#4B0082', '#8A2BE2', '#9370DB', '#DA70D6', '#BA55D3', 
  '#9932CC', '#800080', '#483D8B', '#6A5ACD', '#7B68EE'
];

if (drivers.length === 0) {
    drivers = [
        { id: 'DRV-001', name: 'Kofi Mensah', vehicleType: 'Standard Cargo Van', status: 'Available' },
        { id: 'DRV-002', name: 'Abeiku Acquah', vehicleType: 'Motorbike', status: 'Available' },
        { id: 'DRV-003', name: 'Esi Prah', vehicleType: 'Heavy Duty Truck', status: 'On-trip' },
        { id: 'DRV-004', name: 'Yaw Asante', vehicleType: 'Standard Cargo Van', status: 'Available' },
    ];
}

if (customers.length === 0) {
    customers = Array.from({ length: 5 }, (_, i) => {
        const customerTypes: Customer['customerType'][] = ['Retailer', 'Wholesaler', 'Other'];
        const paymentPreferences: Customer['paymentPreference'][] = ['Cash', 'Credit'];
        return {
            id: `CUS-${101 + i}`,
            name: `Customer ${101 + i}`,
            phone: `+233 24 123 45${60+i}`,
            email: `customer${101+i}@example.com`,
            location: getRandomLocation(),
            customerType: customerTypes[i % 3],
            paymentPreference: paymentPreferences[i % 2],
        };
    });
}


if (orders.length === 0) {
    orders = Array.from({ length: 20 }, (_, i) => {
        const customer = customers[i % customers.length];
        const id = `ORD-${101 + i}`;
        const pickup = getRandomLocation();
        let destination = customer.location;

        const statuses: Order['status'][] = ['Moving', 'Idle', 'Returning', 'Delivered', 'Pending', 'Cancelled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const paymentStatus: Order['paymentStatus'] = 'Paid';
        
        let assignedDriver: Driver | undefined;
        if (status === 'Moving' || status === 'Returning' || status === 'Idle' || status === 'Delivered') {
            assignedDriver = drivers.find(d => d.id === `DRV-00${(i % 3) + 1}`);
        }

        let currentLocation: { lat: number, lng: number } | null = null;
          if (status === 'Moving' || status === 'Returning') {
            currentLocation = {
              lat: pickup.coords.lat + (destination.coords.lat - pickup.coords.lat) * Math.random(),
              lng: pickup.coords.lng + (destination.coords.lng - destination.coords.lng) * Math.random(),
            };
          } else if (status === 'Idle') {
            currentLocation = {
              lat: pickup.coords.lat + (Math.random() - 0.5) * 0.1,
              lng: pickup.coords.lng + (Math.random() - 0.5) * 0.1,
            };
          } else if (status === 'Delivered') {
            currentLocation = destination.coords;
          }

        return {
            id,
            customerId: customer.id,
            customerName: customer.name,
            item: `ITM-00${(i % 5) + 1}`,
            status,
            paymentStatus,
            pickup,
            destination,
            orderDate: `2024-05-${20 + (i % 10)}`,
            currentLocation,
            routeColor: routeColors[i % routeColors.length],
            driverId: assignedDriver?.id,
            driverName: assignedDriver?.name,
        };
    });
}


// Functions to interact with the data

// == INVENTORY ==
export async function getInventory(): Promise<InventoryItem[]> {
  const updatedInventory = inventory.map(item => ({
    ...item,
    status: item.quantity <= item.minThreshold && item.status !== 'Inbound' && item.status !== 'Outbound' ? 'Low Stock' : item.status
  }));
  return Promise.resolve(updatedInventory);
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>): Promise<InventoryItem> {
  const newId = `ITM-${String(inventory.length + 1).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const newItem: InventoryItem = {
    ...item,
    id: newId,
    status: item.quantity <= item.minThreshold ? 'Low Stock' : 'In Stock',
    lastUpdated: today,
  };
  inventory = [...inventory, newItem];
  return Promise.resolve(newItem);
}

// == CUSTOMERS ==
export async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(customers);
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const newId = `CUS-${String(101 + customers.length)}`;
  const newCustomer: Customer = { id: newId, ...customer };
  customers = [newCustomer, ...customers];
  return Promise.resolve(newCustomer);
}


// == ORDERS ==
export async function getOrders(): Promise<Order[]> {
  return Promise.resolve(orders);
}

export async function addOrder(newOrderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'currentLocation' | 'pickup'>): Promise<Order> {
    const newId = `ORD-${String(101 + orders.length)}`;
    const today = new Date().toISOString().split('T')[0];
    const customer = customers.find(c => c.id === newOrderData.customerId);
    if (!customer) throw new Error("Customer not found");

    const newOrder: Order = {
        ...newOrderData,
        id: newId,
        orderDate: today,
        status: 'Pending',
        currentLocation: null,
        pickup: getRandomLocation(), // Simulate pickup from a random warehouse
    };
    orders = [newOrder, ...orders];
    return Promise.resolve(newOrder);
}

export async function updateOrder(updatedOrder: Order): Promise<Order> {
    orders = orders.map(order => order.id === updatedOrder.id ? updatedOrder : order);
    return Promise.resolve(updatedOrder);
}

export async function updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<Order> {
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
        if (order.id === orderId) {
            const currentLocation = newStatus === 'Moving' ? order.pickup.coords : order.currentLocation;
            updatedOrder = { ...order, status: newStatus, currentLocation };
            return updatedOrder;
        }
        return order;
    });
    if (updatedOrder) {
        return Promise.resolve(updatedOrder);
    }
    return Promise.reject(new Error("Order not found"));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    return Promise.resolve(orders.find(order => order.id === id));
}

// == DRIVERS ==
export async function getDrivers(): Promise<Driver[]> {
    return Promise.resolve(drivers);
}

export async function assignDriver(orderId: string, driverId: string): Promise<Order> {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return Promise.reject(new Error("Driver not found"));
    
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
        if (order.id === orderId) {
            updatedOrder = { 
                ...order, 
                driverId: driver.id,
                driverName: driver.name,
                status: 'Moving', // Automatically set to moving on assignment
                currentLocation: order.pickup.coords, // Start trip from pickup location
            };
            return updatedOrder;
        }
        return order;
    });
    
    if (updatedOrder) {
        // Also update the driver's status
        drivers = drivers.map(d => d.id === driverId ? { ...d, status: 'On-trip' } : d);
        return Promise.resolve(updatedOrder);
    }
    
    return Promise.reject(new Error("Order not found"));
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
                const newStatus = order.status === 'Moving' ? 'Delivered' : 'Idle';
                // Make driver available again
                if (order.driverId) {
                    drivers = drivers.map(d => d.id === order.driverId ? { ...d, status: 'Available'} : d);
                }
                return { 
                    ...order, 
                    currentLocation: destination, 
                    status: newStatus,
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
