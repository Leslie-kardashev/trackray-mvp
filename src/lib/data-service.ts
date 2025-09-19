
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
 * Updates an order's status and handles activating the next pending order.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }
    
    const completedOrder = orders[orderIndex];
    const driverId = completedOrder.driverId;
    completedOrder.status = status;

    const isCompleted = status === 'Delivered' || status === 'Cancelled' || status === 'Returning';

    if (isCompleted) {
        completedOrder.completedAt = new Date().toISOString();

        // If the order was a return, log the reason.
        if (status === 'Returning' && returnReason) {
            completedOrder.returnReason = returnReason;
        }

        // Now, find and activate the next pending order for this driver.
        const nextPendingOrder = orders
            .filter(o => o.driverId === driverId && o.status === 'Pending')
            .sort((a, b) => a.id.localeCompare(b.id))[0]; // Get the next one in sequence

        if (nextPendingOrder) {
            const nextOrderIndex = orders.findIndex(o => o.id === nextPendingOrder.id);
            if (nextOrderIndex !== -1) {
                console.log(`Activating next order ${nextPendingOrder.id} for driver ${driverId}`);
                orders[nextOrderIndex].status = 'Moving';
            }
        }
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
        // In a real app, this data would be uploaded to a storage service.
        // For the mock, we'll just log it and update the order record.
        orders[orderIndex].returnPhotoUrl = `/returns/${orderId}-photo.jpg`; // Simulate a stored photo URL
    }
    
    // After confirmation, the status update flow handles completion.
    // If confirmation is just part of a return, the status is already 'Returning'.
    // If this confirmation completes a delivery, we'd call updateOrderStatus here.
    // For this demo, the primary status update buttons handle the logic flow.
    
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
