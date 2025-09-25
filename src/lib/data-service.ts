

'use server';

import { type InventoryItem, type Order, type Customer, type Driver, type SOSMessage, type Complaint } from './types';

// In-memory data stores to simulate a database
let inventory: InventoryItem[] = [];
let orders: Order[] = [];
let customers: Customer[] = [];
let drivers: Driver[] = [];
let sosMessages: SOSMessage[] = [];
let complaints: Complaint[] = [];


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

if (inventory.length === 0) {
    inventory = [
      { id: 'ITM-001', name: 'Milo Cereal (500g)', category: "FMCG", quantity: 500, status: 'In Stock', lastUpdated: '2024-05-20', unitCost: 35.00, minThreshold: 100 },
      { id: 'ITM-002', name: 'Nido Milk Powder (400g)', category: "FMCG", quantity: 350, status: 'In Stock', lastUpdated: '2024-05-21', unitCost: 45.00, minThreshold: 80 },
      { id: 'ITM-003', name: 'Maggi Cubes (100-pack)', category: "FMCG", quantity: 800, status: 'In Stock', lastUpdated: '2024-05-22', unitCost: 20.00, minThreshold: 200 },
      { id: 'ITM-004', name: 'Cerelac Infant Cereal (Maize)', category: "FMCG", quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23', unitCost: 28.00, minThreshold: 50 },
      { id: 'ITM-005', name: 'Ideal Milk (Evaporated, 12-pack)', category: "FMCG", quantity: 250, status: 'In Stock', lastUpdated: '2024-05-19', unitCost: 60.00, minThreshold: 70 },
      { id: 'ITM-006', name: 'Frytol Cooking Oil (3L)', category: "FMCG", quantity: 180, status: 'In Stock', lastUpdated: '2024-05-24', unitCost: 85.00, minThreshold: 50 },
      { id: 'ITM-007', name: 'Omo Detergent (1kg)', category: "FMCG", quantity: 40, status: 'Low Stock', lastUpdated: '2024-05-24', unitCost: 25.00, minThreshold: 50 },
    ];
}

if (drivers.length === 0) {
    drivers = [
        { id: 'DRV-001', name: 'Kofi Mensah', vehicleType: 'Standard Cargo Van', status: 'Available', phone: '+233555111222' },
        { id: 'DRV-002', name: 'Abeiku Acquah', vehicleType: 'Motorbike', status: 'Available', phone: '+233555333444' },
        { id: 'DRV-003', name: 'Esi Prah', vehicleType: 'Heavy Duty Truck', status: 'On-trip', phone: '+233555555666' },
        { id: 'DRV-004', name: 'Yaw Asante', vehicleType: 'Standard Cargo Van', status: 'Available', phone: '+233555777888' },
    ];
}

if (customers.length === 0) {
    const firstNames = ["Ama", "Kwaku", "Adwoa", "Kofi", "Abena", "Yaw", "Akosua", "Kwame", "Yaa", "Kojo"];
    const lastNames = ["Mensah", "Owusu", "Boateng", "Osei", "Addo", "Annan", "Nkrumah", "Agyepong", "Asante", "Ofori"];

    customers = Array.from({ length: 15 }, (_, i) => {
        const customerTypes: Customer['customerType'][] = ['Retailer', 'Wholesaler', 'Other'];
        const paymentPreferences: Customer['paymentPreference'][] = ['Cash', 'Credit'];
        return {
            id: `CUS-${101 + i}`,
            name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
            phone: `+233 24 123 45${60+i}`,
            email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
            location: getRandomLocation(),
            customerType: customerTypes[i % 3],
            paymentPreference: paymentPreferences[i % 2],
        };
    });
}


if (orders.length === 0) {
    orders = Array.from({ length: 30 }, (_, i) => {
        const customer = customers[i % customers.length];
        const id = `ORD-${101 + i}`;
        const pickup = getRandomLocation();
        let destination = customer.location;

        const statuses: Order['status'][] = ['Pending', 'Confirmed', 'Ready for Dispatch'];
        const status = statuses[i % statuses.length];
        
        const paymentStatuses: Order['paymentStatus'][] = ['Paid', 'Pay on Credit', 'Pending'];
        const paymentStatus = paymentStatuses[i % 3];
        
        let assignedDriver: Driver | undefined;
        if (['Ready for Dispatch'].includes(status)) {
            assignedDriver = drivers.find(d => d.id === `DRV-00${(i % 3) + 1}`);
        }
        
        let currentLocation: { lat: number, lng: number } | null = null;
        if (status === 'Ready for Dispatch' || status === 'Confirmed' || status === 'Pending') {
            currentLocation = pickup.coords;
        }

        const quantity = Math.floor(Math.random() * 50) + 1;
        const inventoryItem = inventory[(i % inventory.length)];
        const unitPrice = inventoryItem.unitCost;
        const orderValue = quantity * unitPrice;
        
        // Higher order value = lower (better) priority score
        const priorityScore = 1 / (orderValue || 1) * 10000;
        
        // Add scheduled pickup time for relevant orders
        let scheduledPickupTime: string | undefined;
        if (status === 'Ready for Dispatch') {
            const now = new Date();
            const offsetHours = (i % 5) - 2; 
            now.setHours(now.getHours() + offsetHours);
            scheduledPickupTime = now.toISOString();
        }

        return {
            id,
            customerId: customer.id,
            customerName: customer.name,
            item: inventoryItem.name,
            quantity,
            unitPrice,
            orderValue,
            status,
            paymentStatus,
            pickup,
            destination,
            orderDate: `2024-05-${1 + (i % 28)}`,
            scheduledPickupTime,
            currentLocation,
            routeColor: routeColors[i % routeColors.length],
            driverId: assignedDriver?.id,
            driverName: assignedDriver?.name,
            priorityScore,
        };
    });
}

if (complaints.length === 0) {
    complaints = [
        {
            id: 'CMP-001',
            orderId: 'ORD-101',
            customerId: 'CUS-101',
            customerName: 'Ama Mensah',
            complaintType: 'Lateness',
            description: 'My package was 3 hours late and I could not reach the driver.',
            status: 'Open',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
            id: 'CMP-002',
            orderId: 'ORD-105',
            customerId: 'CUS-105',
            customerName: 'Abena Addo',
            complaintType: 'Damaged Item',
            description: 'The box was crushed and the items inside were broken.',
            status: 'Resolved',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        }
    ];
}


// Functions to interact with the data

// == INVENTORY ==
export async function getInventory(): Promise<InventoryItem[]> {
  const updatedInventory = inventory.map(item => ({
    ...item,
    status: item.quantity <= item.minThreshold && item.status !== 'Inbound' && item.status !== 'Outbound' ? 'Low Stock' : 'In Stock'
  }));
  return Promise.resolve(updatedInventory);
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated' | 'unitCost' | 'minThreshold' | 'category'>): Promise<InventoryItem> {
  const newId = `ITM-${String(inventory.length + 1).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const newItem: InventoryItem = {
    ...item,
    id: newId,
    status: item.quantity <= 20 ? 'Low Stock' : 'In Stock',
    lastUpdated: today,
    unitCost: Math.round(Math.random() * 50 + 10),
    minThreshold: 20,
    category: "FMCG"
  };
  inventory = [...inventory, newItem];
  return Promise.resolve(newItem);
}

// == CUSTOMERS ==
export async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(customers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    return Promise.resolve(customers.find(c => c.id === id));
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const newId = `CUS-${String(101 + customers.length)}`;
  const newCustomer: Customer = { id: newId, ...customer };
  customers = [newCustomer, ...customers];
  return Promise.resolve(newCustomer);
}


// == ORDERS ==
export async function getOrders(): Promise<Order[]> {
  return Promise.resolve(orders.filter(o => o.status !== 'Archived'));
}

export async function getArchivedOrders(): Promise<Order[]> {
    return Promise.resolve(orders.filter(o => ['Delivered', 'Cancelled', 'Archived'].includes(o.status)));
}

export async function addOrder(newOrderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'currentLocation' | 'unitPrice' | 'quantity' | 'priorityScore'>): Promise<Order> {
    const newId = `ORD-${String(101 + orders.length)}`;
    const today = new Date().toISOString().split('T')[0];
    const customer = customers.find(c => c.id === newOrderData.customerId);
    if (!customer) throw new Error("Customer not found");

    const quantity = Math.floor(Math.random() * 50) + 1;
    const unitPrice = newOrderData.orderValue ? newOrderData.orderValue / quantity : 0;
    const priorityScore = 1 / (newOrderData.orderValue || 1) * 10000;


    const newOrder: Order = {
        ...newOrderData,
        id: newId,
        orderDate: today,
        status: 'Pending',
        currentLocation: null,
        pickup: newOrderData.pickup || getRandomLocation(),
        destination: newOrderData.destination || customer.location,
        quantity: quantity,
        unitPrice: unitPrice,
        priorityScore,
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
            updatedOrder = { ...order, status: newStatus };
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

export async function confirmOrderPickup(orderId: string): Promise<Order> {
  let updatedOrder: Order | undefined;
  orders = orders.map(order => {
    if (order.id === orderId && order.status === 'Ready for Dispatch') {
      updatedOrder = { 
        ...order, 
        status: 'Delivered', // Simplified for warehouse focus
        currentLocation: order.destination.coords
      };
      return updatedOrder;
    }
    return order;
  });

  if (updatedOrder) {
    return Promise.resolve(updatedOrder);
  }
  return Promise.reject(new Error("Order not found or not ready for pickup."));
}


// == DRIVERS ==
export async function getDrivers(): Promise<Driver[]> {
    return Promise.resolve(drivers);
}

export async function getDriverById(id: string): Promise<Driver | undefined> {
    return Promise.resolve(drivers.find(driver => driver.id === id));
}

export async function assignDriver(orderId: string, driverId: string): Promise<Order> {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return Promise.reject(new Error("Driver not found"));
    
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
        if (order.id === orderId) {
            const pickupTime = new Date();
            pickupTime.setHours(pickupTime.getHours() + 1); // Schedule for 1 hour from now

            updatedOrder = { 
                ...order, 
                driverId: driver.id,
                driverName: driver.name,
                status: 'Ready for Dispatch', // Change status to indicate it's waiting for pickup
                currentLocation: order.pickup.coords, // Location is now the pickup point
                scheduledPickupTime: pickupTime.toISOString(),
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
    return Promise.resolve(orders.filter(o => o.status !== 'Archived'));
}

// == SOS MESSAGES ==
export async function getSOSMessages(): Promise<SOSMessage[]> {
    // Return messages sorted by newest first
    return Promise.resolve(sosMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
}

export async function sendSOS(message: Omit<SOSMessage, 'id' | 'timestamp'>): Promise<SOSMessage> {
    const newSOS: SOSMessage = {
        ...message,
        id: `SOS-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    sosMessages = [newSOS, ...sosMessages];
    return Promise.resolve(newSOS);
}

// == COMPLAINTS ==
export async function getComplaints(customerId?: string): Promise<Complaint[]> {
    let filteredComplaints = complaints;
    if (customerId) {
        filteredComplaints = complaints.filter(c => c.customerId === customerId);
    }
    return Promise.resolve(filteredComplaints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
}

export async function addComplaint(complaintData: Omit<Complaint, 'id' | 'timestamp' | 'status'>): Promise<Complaint> {
    const newComplaint: Complaint = {
        ...complaintData,
        id: `CMP-${String(complaints.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toISOString(),
        status: 'Open',
    };
    complaints = [newComplaint, ...complaints];
    return Promise.resolve(newComplaint);
}
