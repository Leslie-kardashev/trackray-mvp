
'use server';

// This is a mock data service that simulates reads and writes.
// In a real application, this would be replaced with calls to a backend API or a database.
// To make this work in a stateless serverless environment, we are using a hack:
// we are abusing the require cache to simulate a persistent in-memory store.
// This is NOT a good practice for production but is acceptable for a self-contained demo.

import { mockOrders as initialOrders } from './mock-data';
import { type Order } from './types';

// The "in-memory database". In a Node.js environment, modules are cached.
// We can exploit this to create a shared, mutable state across requests
// within the same server instance. This is NOT reliable across different instances
// or server restarts, but it's better than having no persistence for a demo.
let orders: Order[] = JSON.parse(JSON.stringify(initialOrders));


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
    console.log(`Fetching all ${orders.length} orders from in-memory store.`);
    return JSON.parse(JSON.stringify(orders)); // Return a deep copy
}

/**
 * Updates an order's status.
 * This function will now modify the in-memory 'orders' array.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }
    
    const updatedOrder = { ...orders[orderIndex] };
    updatedOrder.status = status;

    const isCompleted = status === 'Delivered' || status === 'Cancelled' || status === 'Returning';

    if (isCompleted) {
        // In a real app, this would be `completedAt`, but for the demo we're aligning with existing data.
        if (status === 'Returning' && returnReason) {
           // updatedOrder.returnReason = returnReason;
        }
    }
    
    // Replace the old order with the updated one
    orders[orderIndex] = updatedOrder;
    
    console.log(`Order ${orderId} status updated in-memory.`);
}


/**
 * Simulates sending the delivery confirmation to the backend.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: 'PHOTO' | 'SIGNATURE'): Promise<{success: boolean}> {
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }

    if (method === 'PHOTO') {
        console.log(`[SIMULATION] Received photo data for return of order ${orderId}`);
        // In a real app, this data would be uploaded to a storage service.
        // orders[orderIndex].returnPhotoUrl = `/returns/${orderId}-photo.jpg`; // Mock URL
    }
    
    console.log(`Confirmation for order ${orderId} processed.`);
    return { success: true };
}
