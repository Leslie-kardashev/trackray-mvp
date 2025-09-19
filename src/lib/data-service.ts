
'use server';

// This is a mock data service. In a real application, this would be replaced
// with calls to a backend API or a database. This version uses an in-memory
// store to be compatible with serverless environments like Vercel.

import { mockOrders } from './mock-data';
import { type Order, type SOSMessage } from './types';

// Initialize in-memory store from the mock data source.
// This gets re-initialized on each serverless function invocation,
// which is fine for a demo but would be a database in a real app.
let orders: Order[] = JSON.parse(JSON.stringify(mockOrders));
let sos_messages: SOSMessage[] = [];


// == MOCK API FUNCTIONS ==

/**
 * Fetches a single order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    console.log(`Fetching order by ID: ${orderId}`);
    return orders.find(order => order.id === orderId);
}

/**
 * Fetches the list of all orders.
 */
export async function fetchAllOrders(): Promise<Order[]> {
    console.log(`Fetching all orders`);
    // Return a deep copy to avoid direct mutation of the in-memory store
    return JSON.parse(JSON.stringify(orders));
}

/**
 * Updates an order's status.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }
    
    orders[orderIndex].status = status;

    if (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') {
        orders[orderIndex].completedAt = new Date().toISOString();
    }
    if (status === 'Returning' && returnReason) {
        orders[orderIndex].returnReason = returnReason;
    }
    
    console.log(`Order ${orderId} successfully updated.`);
}


/**
 * Simulates sending the delivery confirmation to the backend.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: Order['confirmationMethod']): Promise<{success: boolean}> {
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }

    if (method === 'PHOTO') {
        console.log(`Received photo data for return of order ${orderId}`);
        orders[orderIndex].returnPhotoUrl = `/returns/${orderId}-photo.jpg`;
    } else {
        await updateOrderStatus(orderId, 'Delivered');
    }
    
    return { success: true };
}


// == SOS MESSAGES ==
export async function getSOSMessages(): Promise<SOSMessage[]> {
    return sos_messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function sendSOS(message: Omit<SOSMessage, 'id' | 'timestamp'>): Promise<SOSMessage> {
    const newSOS: SOSMessage = {
        id: `SOS-${Date.now()}`,
        ...message,
        timestamp: new Date().toISOString(),
    };
    
    console.log('Sending TCAS Alert to backend:', newSOS);
    sos_messages.push(newSOS);
    
    return newSOS;
}
