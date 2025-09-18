
'use server';

import { type Order, type SOSMessage } from './types';

// In-memory data stores to simulate a database
let orders: Order[] = [];
let sosMessages: SOSMessage[] = [];


// Initialize with some mock data if the lists are empty
const ghanaLocations = {
    "Accra": { lat: 5.6037, lng: -0.1870 },
    "Kumasi": { lat: 6.6886, lng: -1.6244 },
    "Takoradi": { lat: 4.9048, lng: -1.7553 },
    "Tema": { lat: 5.6667, lng: -0.0167 },
};
const locationNames = Object.keys(ghanaLocations);
const getRandomLocation = () => {
  const name = locationNames[Math.floor(Math.random() * locationNames.length)];
  return { address: name, coords: ghanaLocations[name as keyof typeof ghanaLocations] };
};

if (orders.length === 0) {
    orders = [
        {
            id: 'ORD-101',
            itemDescription: '20 boxes of Grade A Cocoa Beans',
            status: 'Pending',
            pickup: { address: 'Tema', coords: ghanaLocations['Tema'] },
            destination: { address: 'Accra', coords: ghanaLocations['Accra'] },
            recipientName: 'Ama Serwaa',
            recipientPhone: '+233 24 111 2222',
            confirmationMethod: 'SIGNATURE',
        },
        {
            id: 'ORD-102',
            itemDescription: '50 Kente Cloth Rolls',
            status: 'Pending',
            pickup: { address: 'Kumasi', coords: ghanaLocations['Kumasi'] },
            destination: { address: 'Takoradi', coords: ghanaLocations['Takoradi'] },
            recipientName: 'Kwesi Jones',
            recipientPhone: '+233 20 333 4444',
            confirmationMethod: 'PHOTO',
        },
        {
            id: 'ORD-103',
            itemDescription: 'Emergency Medical Supplies',
            status: 'Pending',
            pickup: { address: 'Accra', coords: ghanaLocations['Accra'] },
            destination: { address: 'Kumasi', coords: ghanaLocations['Kumasi'] },
            recipientName: 'Dr. Evelyn Adjei',
            recipientPhone: '+233 55 555 6666',
            confirmationMethod: 'OTP',
        }
    ];
}


// == MOCK API FUNCTIONS ==

/**
 * Simulates fetching the list of orders assigned to the logged-in driver.
 * The backend would handle prioritization.
 */
export async function getAssignedOrders(driverId: string): Promise<Order[]> {
  console.log(`Fetching orders for driver: ${driverId}`);
  // In a real app, this would be an API call:
  // const response = await fetch(`https://your-django-api.com/drivers/${driverId}/orders`);
  // const data = await response.json();
  // return data;

  // For now, return the mock data.
  return Promise.resolve(orders.filter(o => o.status === 'Pending' || o.status === 'Moving'));
}

/**
 * Simulates updating an order's status.
 * e.g., when a driver accepts a route and status changes from 'Assigned' to 'En Route'.
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
        if (order.id === orderId) {
            updatedOrder = { ...order, status: status };
            return updatedOrder;
        }
        return order;
    });

    if (updatedOrder) {
        console.log(`Order ${orderId} status updated to ${status}`);
        // In a real app, this would be a PATCH request:
        // await fetch(`https://your-django-api.com/orders/${orderId}`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ status: status })
        // });
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
    console.log(`Confirmation data: ${confirmationData.substring(0, 50)}...`);
    
    updateOrderStatus(orderId, 'Delivered');

    // In a real app, this would be a POST request to a confirmation endpoint:
    // await fetch(`https://your-django-api.com/orders/${orderId}/confirm`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         method: method,
    //         data: confirmationData,
    //         timestamp: new Date().toISOString(),
    //     })
    // });
    
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
    
    // In a real app, this would be a POST request to the backend
    // The backend would then handle sending this to the admin dashboard via websockets or push notifications.
    console.log('Sending SOS to backend:', newSOS);

    return Promise.resolve(newSOS);
}
