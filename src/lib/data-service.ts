
'use server';

import { type Order, type SOSMessage } from './types';

// In-memory data stores to simulate a database
let orders: Order[] = [];
let sosMessages: SOSMessage[] = [];


// Initialize with some mock data if the lists are empty
const ghanaLocations = {
    "Achimota Mall": { lat: 5.6416, lng: -0.2343 },
    "Kumasi": { lat: 6.6886, lng: -1.6244 },
    "Takoradi": { lat: 4.9048, lng: -1.7553 },
    "Tema": { lat: 5.6667, lng: -0.0167 },
};

if (orders.length === 0) {
    orders = [
        {
            id: 'ORD-101',
            itemDescription: '20 boxes of Grade A Cocoa Beans',
            quantity: 20,
            status: 'Pending',
            pickup: { address: 'Tema', coords: ghanaLocations['Tema'] },
            destination: { address: 'Achimota Mall', coords: ghanaLocations['Achimota Mall'] },
            recipientName: 'Ama Serwaa',
            recipientPhone: '+233 24 111 2222',
            confirmationMethod: 'SIGNATURE',
            requestedDeliveryTime: '2024-07-25T14:00:00Z',
            productPrice: 1500.00,
        },
        {
            id: 'ORD-102',
            itemDescription: '50 Kente Cloth Rolls',
            quantity: 50,
            status: 'Pending',
            pickup: { address: 'Kumasi', coords: ghanaLocations['Kumasi'] },
            destination: { address: 'Achimota Mall', coords: ghanaLocations['Achimota Mall'] },
            recipientName: 'Kwesi Jones',
            recipientPhone: '+233 20 333 4444',
            confirmationMethod: 'PHOTO',
            requestedDeliveryTime: '2024-07-25T17:00:00Z',
            productPrice: 3250.50,
        },
        {
            id: 'ORD-103',
            itemDescription: 'Emergency Medical Supplies',
            quantity: 5,
            status: 'Pending',
            pickup: { address: 'Takoradi', coords: ghanaLocations['Takoradi'] },
            destination: { address: 'Achimota Mall', coords: ghanaLocations['Achimota Mall'] },
            recipientName: 'Dr. Evelyn Adjei',
            recipientPhone: '+233 55 555 6666',
            confirmationMethod: 'OTP',
            productPrice: 800.00,
        }
    ];
}


// == MOCK API FUNCTIONS ==

/**
 * Simulates fetching a single order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    console.log(`Fetching order by ID: ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return Promise.resolve(orders.find(o => o.id === orderId));
}


/**
 * Simulates fetching the list of orders assigned to the logged-in driver.
 */
export async function getAssignedOrders(driverId: string): Promise<Order[]> {
  console.log(`Fetching orders for driver: ${driverId}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return Promise.resolve(JSON.parse(JSON.stringify(orders))); // Return a deep copy
}

/**
 * Simulates updating an order's status.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<Order> {
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
        if (order.id === orderId) {
            const completedAt = (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') ? new Date().toISOString() : order.completedAt;
            updatedOrder = { ...order, status, completedAt };
            if (status === 'Returning' && returnReason) {
                updatedOrder.returnReason = returnReason;
            }
            return updatedOrder;
        }
        return order;
    });

    if (updatedOrder) {
        console.log(`Order ${orderId} status updated to ${status}`);
        return Promise.resolve(updatedOrder);
    }
    return Promise.reject(new Error("Order not found"));
}

/**
 * Simulates sending the delivery confirmation to the backend.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: Order['confirmationMethod']): Promise<{success: boolean}> {
    const order = orders.find(o => o.id === orderId);
    if (!order) return Promise.reject(new Error("Order not found"));

    console.log(`Confirming delivery for order ${orderId} via ${method}.`);
    
    // If the method is PHOTO, it's for a return, so we don't change the status here.
    // The 'Returning' status is managed separately.
    // If it's a standard delivery confirmation, we mark it as delivered.
    if (method !== 'PHOTO') {
        await updateOrderStatus(orderId, 'Delivered');
    } else {
        console.log(`Photo for returned goods for order ${orderId} has been logged.`);
        // In a real app, you would upload this photo to a storage service.
    }
    
    return Promise.resolve({ success: true });
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
    
    console.log('Sending TCAS Alert to backend:', newSOS);

    return Promise.resolve(newSOS);
}
