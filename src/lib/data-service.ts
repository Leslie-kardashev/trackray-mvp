
'use server';

import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, Timestamp, orderBy, addDoc } from 'firebase/firestore';
import { db, storage } from './firebase-config';
import { type Order, type SOSMessage } from './types';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const ORDERS_COLLECTION = 'orders';
const SOS_COLLECTION = 'sos_messages';

// == MOCK API FUNCTIONS using Firestore ==

/**
 * Fetches a single order by its ID from Firestore.
 */
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    console.log(`Fetching order by ID: ${orderId}`);
    try {
        const docRef = doc(db, ORDERS_COLLECTION, orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                // Convert Firestore Timestamps to ISO strings
                requestedDeliveryTime: (data.requestedDeliveryTime as Timestamp)?.toDate().toISOString(),
                completedAt: (data.completedAt as Timestamp)?.toDate().toISOString(),
            } as Order;
        } else {
            console.log("No such document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw error;
    }
}

/**
 * Fetches the list of orders assigned to a specific driver from Firestore.
 * This function will be replaced by a real-time listener on the client.
 */
export async function getAssignedOrders(driverId: string): Promise<Order[]> {
  console.log(`Fetching orders for driver: ${driverId}`);
  try {
      const q = query(collection(db, ORDERS_COLLECTION), where("driverId", "==", driverId));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          orders.push({
              id: doc.id,
              ...data,
              requestedDeliveryTime: (data.requestedDeliveryTime as Timestamp)?.toDate().toISOString(),
              completedAt: (data.completedAt as Timestamp)?.toDate().toISOString(),
          } as Order);
      });
      return orders;
  } catch (error) {
      console.error("Error fetching assigned orders:", error);
      throw error;
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
    console.log(`Fetching all orders`);
    try {
        const q = query(collection(db, ORDERS_COLLECTION));
        const querySnapshot = await getDocs(q);
        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
                id: doc.id,
                ...data,
                requestedDeliveryTime: (data.requestedDeliveryTime as Timestamp)?.toDate().toISOString(),
                completedAt: (data.completedAt as Timestamp)?.toDate().toISOString(),
            } as Order);
        });
        return orders;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
}

/**
 * Updates an order's status in Firestore.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], returnReason?: string): Promise<void> {
    console.log(`Updating order ${orderId} status to ${status}`);
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    
    const updateData: { status: Order['status'], completedAt?: Timestamp, returnReason?: string } = { status };

    if (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') {
        updateData.completedAt = Timestamp.now();
    }
    if (status === 'Returning' && returnReason) {
        updateData.returnReason = returnReason;
    }

    try {
        await updateDoc(orderRef, updateData);
        console.log(`Order ${orderId} successfully updated.`);
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status.");
    }
}

/**
 * Simulates sending the delivery confirmation to the backend.
 * Now uploads photo to Firebase Storage.
 */
export async function confirmDelivery(orderId: string, confirmationData: string, method: Order['confirmationMethod']): Promise<{success: boolean}> {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    if (method === 'PHOTO') {
        console.log(`Uploading return photo for order ${orderId}...`);
        const storageRef = ref(storage, `returns/${orderId}/${Date.now()}.jpg`);
        
        try {
            const snapshot = await uploadString(storageRef, confirmationData, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            // Store the photo URL in the order document
            await updateDoc(orderRef, {
                returnPhotoUrl: downloadURL,
            });
            
            console.log("Photo uploaded and URL saved to order.");
            return { success: true };

        } catch (error) {
            console.error('Failed to upload photo:', error);
            throw new Error('Could not submit the photo.');
        }

    } else {
        // Handle other confirmation methods if necessary
        await updateOrderStatus(orderId, 'Delivered');
        return { success: true };
    }
}


// == SOS MESSAGES ==
export async function getSOSMessages(): Promise<SOSMessage[]> {
    try {
        const q = query(collection(db, SOS_COLLECTION), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const messages: SOSMessage[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                ...data,
                timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
            } as SOSMessage);
        });
        return messages;
    } catch (error) {
        console.error("Error fetching SOS messages:", error);
        throw error;
    }
}

export async function sendSOS(message: Omit<SOSMessage, 'id' | 'timestamp'>): Promise<SOSMessage> {
    const newSOSData = {
        ...message,
        timestamp: Timestamp.now(),
    };
    
    try {
        const docRef = await addDoc(collection(db, SOS_COLLECTION), newSOSData);
        console.log('Sending TCAS Alert to backend:', newSOSData);
        return {
            id: docRef.id,
            ...newSOSData,
            timestamp: newSOSData.timestamp.toDate().toISOString(),
        };
    } catch (error) {
        console.error('Failed to send SOS to Firestore:', error);
        throw new Error('Failed to send SOS alert.');
    }
}
