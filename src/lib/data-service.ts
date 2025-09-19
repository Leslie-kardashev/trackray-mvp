
'use server';

// This is a mock data service. In a real application, this would be replaced
// with calls to a backend API or a database.

import { promises as fs } from 'fs';
import path from 'path';
import { type Order, type SOSMessage } from './types';

const MOCK_DATA_PATH = path.join(process.cwd(), 'src/lib/mock-data-store.json');

type MockDataStore = {
  orders: Order[];
  sos_messages: SOSMessage[];
};

// Helper function to read the mock data from the JSON file
async function readData(): Promise<MockDataStore> {
  try {
    const data = await fs.readFile(MOCK_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return a default structure
    return { orders: [], sos_messages: [] };
  }
}

// Helper function to write data to the mock data JSON file
async function writeData(data: MockDataStore): Promise<void> {
  await fs.writeFile(MOCK_DATA_PATH, JSON.stringify(data, null, 2));
}


// == MOCK API FUNCTIONS ==

/**
 * Fetches a single order by its ID.
 */
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    console.log(`Fetching order by ID: ${orderId}`);
    const { orders } = await readData();
    return orders.find(order => order.id === orderId);
}

/**
 * Fetches the list of all orders.
 */
export async function fetchAllOrders(): Promise<Order[]> {
    console.log(`Fetching all orders`);
    const { orders } = await readData();
    return orders;
}

/**
 * Updates an order's status.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    const data = await readData();
    const orderIndex = data.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }
    
    data.orders[orderIndex].status = status;

    if (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') {
        data.orders[orderIndex].completedAt = new Date().toISOString();
    }
    if (status === 'Returning' && returnReason) {
        data.orders[orderIndex].returnReason = returnReason;
    }
    
    await writeData(data);
    console.log(`Order ${orderId} successfully updated.`);
}


/**
 * Simulates sending the delivery confirmation to the backend.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: Order['confirmationMethod']): Promise<{success: boolean}> {
    const data = await readData();
    const orderIndex = data.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        throw new Error("Order not found.");
    }

    if (method === 'PHOTO') {
        // In a real app, this base64 data would be uploaded to a storage service.
        // For now, we'll just log it and mark the return as processed.
        console.log(`Received photo data for return of order ${orderId}`);
        // We'll store a placeholder URL to indicate the photo was "uploaded"
        data.orders[orderIndex].returnPhotoUrl = `/returns/${orderId}-photo.jpg`;
    } else {
        await updateOrderStatus(orderId, 'Delivered');
    }
    
    await writeData(data);
    return { success: true };
}


// == SOS MESSAGES ==
export async function getSOSMessages(): Promise<SOSMessage[]> {
    const { sos_messages } = await readData();
    return sos_messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function sendSOS(message: Omit<SOSMessage, 'id' | 'timestamp'>): Promise<SOSMessage> {
    const data = await readData();
    const newSOS: SOSMessage = {
        id: `SOS-${Date.now()}`,
        ...message,
        timestamp: new Date().toISOString(),
    };
    
    console.log('Sending TCAS Alert to backend:', newSOS);
    data.sos_messages.push(newSOS);
    await writeData(data);
    
    return newSOS;
}
