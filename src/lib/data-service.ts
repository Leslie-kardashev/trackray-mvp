
'use server';

// This is a mock data service. In a real application, this would be replaced
// with calls to a backend API or a database. This version simulates a
// stateless service compatible with serverless environments.

import { mockOrders } from './mock-data';
import { type Order, type SOSMessage } from './types';

// In a serverless environment, in-memory variables are not guaranteed to persist
// across invocations. We will simulate a persistent store by reading from
// the mock data source on each call. NOTE: Updates will not persist.
let sos_messages: SOSMessage[] = [];


// == MOCK API FUNCTIONS ==

/**
 * Fetches a single order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    console.log(`Fetching order by ID: ${orderId}`);
    // In a stateless environment, read from the source every time.
    const orders: Order[] = JSON.parse(JSON.stringify(mockOrders));
    return orders.find(order => order.id === orderId);
}

/**
 * Fetches the list of all orders.
 */
export async function fetchAllOrders(): Promise<Order[]> {
    console.log(`Fetching all orders`);
    // Return a deep copy to ensure the source is not mutated.
    const orders: Order[] = JSON.parse(JSON.stringify(mockOrders));
    return orders;
}

/**
 * Updates an order's status.
 * NOTE: In this simulated stateless environment, this change will NOT persist
 * across different requests. It's for UI demonstration within a single user flow.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    
    // To simulate an update, we would need a persistent data store (e.g., Firestore, Postgres).
    // Since we are using a mock file, we cannot durably save the change.
    // The UI will appear to work for the current user session, but the change
    // will be gone on the next full page load or for any other user.
    
    console.log(`[SIMULATION] Order ${orderId} status would be updated to ${status}.`);
    // Find the order in the current request's copy of the data.
    const orders: Order[] = JSON.parse(JSON.stringify(mockOrders));
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }
    
    // The rest of this function demonstrates the logic that *would* run if we had a database.
    const completedOrder = orders[orderIndex];
    completedOrder.status = status;

    const isCompleted = status === 'Delivered' || status === 'Cancelled' || status === 'Returning';

    if (isCompleted) {
        completedOrder.completedAt = new Date().toISOString();

        if (status === 'Returning' && returnReason) {
            completedOrder.returnReason = returnReason;
        }

    }
    
    console.log(`Order ${orderId} status change simulated.`);
}


/**
 * Simulates sending the delivery confirmation to the backend.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: Order['confirmationMethod']): Promise<{success: boolean}> {
    const orders: Order[] = JSON.parse(JSON.stringify(mockOrders));
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }

    if (method === 'PHOTO') {
        console.log(`[SIMULATION] Received photo data for return of order ${orderId}`);
        // In a real app, this data would be uploaded to a storage service.
        orders[orderIndex].returnPhotoUrl = `/returns/${orderId}-photo.jpg`;
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
    // This will only persist for the life of the serverless function instance.
    sos_messages.push(newSOS);
    
    return newSOS;
}
