
import { type Order } from './types';

const ghanaLocations = {
  "Accra": { lat: 5.6037, lng: -0.1870 },
  "Kumasi": { lat: 6.6886, lng: -1.6244 },
  "Takoradi": { lat: 4.9048, lng: -1.7553 },
  "Tamale": { lat: 9.4074, lng: -0.8537 },
  "Tema": { lat: 5.6667, lng: -0.0167 },
  "Cape Coast": { lat: 5.1054, lng: -1.2466 },
  "Sunyani": { lat: 7.3333, lng: -2.3333 },
  "Ho": { lat: 6.6119, lng: 0.4713 },
  "Koforidua": { lat: 6.0881, lng: -0.2597 },
  "Wa": { lat: 10.0577, lng: -2.5020 }
};

const locationNames = Object.keys(ghanaLocations);
const getRandomLocation = () => {
  const name = locationNames[Math.floor(Math.random() * locationNames.length)];
  return { address: name, coords: ghanaLocations[name as keyof typeof ghanaLocations] };
}

const itemBases = [
    { product: "Nestlé Milo", unit: "Cases" },
    { product: "Gino Tomato Mix", unit: "Boxes" },
    { product: "Cowbell Milk Powder", unit: "Sacks" },
    { product: "Frytol Cooking Oil", unit: "Cartons" },
    { product: "Ideal Milk", unit: "Pallets" },
    { product: "Indomie Noodles", unit: "Boxes" },
    { product: "Omo Detergent", unit: "Sacks" },
    { product: "Club Beer", unit: "Cases" },
    { product: "Coca-Cola", unit: "Crates" },
    { product: "Royal Aroma Rice", unit: "Bags" }
];

const recipientNames = [
    "Shoprite Accra Mall", "Melcome Shop", "MaxMart - 37",
    "Palace Supermarket", "Koala Shopping Center", "CityDia - Tema",
    "Distributor - Koforidua", "Wholesale Supply - Takoradi", "Jumia Warehouse", "Local Market - Tamale"
];

const generateItems = (count: number): string[] => {
    const items = new Set<string>();
    while (items.size < count) {
        const itemBase = itemBases[Math.floor(Math.random() * itemBases.length)];
        const quantity = Math.floor(Math.random() * 50) + 5;
        items.add(`${quantity} ${itemBase.unit} of ${itemBase.product}`);
    }
    return Array.from(items);
};

// A structured set of orders for DRV-001 to ensure a clear demo flow
const driver1Orders: Order[] = [
  // 1. The active order
  {
    id: "ORD-101",
    driverId: "DRV-001",
    items: generateItems(1),
    status: 'Moving',
    pickup: { address: "Accra", coords: ghanaLocations["Accra"] },
    destination: { address: "Tema", coords: ghanaLocations["Tema"] },
    recipientName: "CityDia - Tema",
    recipientPhone: "0302111222",
    paymentType: 'Pay on Delivery',
    productPrice: 750,
    deliveryFee: 500,
    confirmationMethod: 'PHOTO'
  },
  // 2. Pending orders, will become available after the active one is done
  {
    id: "ORD-102",
    driverId: "DRV-001",
    items: generateItems(2),
    status: 'Pending',
    pickup: { address: "Tema", coords: ghanaLocations["Tema"] },
    destination: { address: "Kumasi", coords: ghanaLocations["Kumasi"] },
    recipientName: "Melcome Shop",
    recipientPhone: "0244333444",
    paymentType: 'Prepaid',
    deliveryFee: 0,
    confirmationMethod: 'SIGNATURE'
  },
  {
    id: "ORD-103",
    driverId: "DRV-001",
    items: generateItems(1),
    status: 'Pending',
    pickup: { address: "Accra", coords: ghanaLocations["Accra"] },
    destination: { address: "Takoradi", coords: ghanaLocations["Takoradi"] },
    recipientName: "Wholesale Supply - Takoradi",
    recipientPhone: "0205556666",
    paymentType: 'Pay on Delivery',
    productPrice: 1200,
    deliveryFee: 500,
    confirmationMethod: 'OTP'
  },
  // 3. Completed orders for the history view
  {
    id: "ORD-104",
    driverId: "DRV-001",
    items: generateItems(1),
    status: 'Delivered',
    pickup: { address: "Accra", coords: ghanaLocations["Accra"] },
    destination: { address: "Cape Coast", coords: ghanaLocations["Cape Coast"] },
    recipientName: "Palace Supermarket",
    recipientPhone: "0277888999",
    paymentType: 'Prepaid',
    deliveryFee: 500,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    confirmationMethod: 'PHOTO'
  },
  {
    id: "ORD-105",
    driverId: "DRV-001",
    items: generateItems(3),
    status: 'Returning',
    pickup: { address: "Tema", coords: ghanaLocations["Tema"] },
    destination: { address: "Ho", coords: ghanaLocations["Ho"] },
    recipientName: "Local Market - Ho",
    recipientPhone: "0266111222",
    paymentType: 'Pay on Delivery',
    productPrice: 2100,
    deliveryFee: 500,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    returnReason: 'Customer Refused',
    returnPhotoUrl: `/returns/ORD-105-photo.jpg`,
    confirmationMethod: 'PHOTO'
  },
  {
    id: "ORD-106",
    driverId: "DRV-001",
    items: generateItems(1),
    status: 'Cancelled',
    pickup: { address: "Accra", coords: ghanaLocations["Accra"] },
    destination: { address: "Sunyani", coords: ghanaLocations["Sunyani"] },
    recipientName: "Jumia Warehouse",
    recipientPhone: "0555444333",
    paymentType: 'Prepaid',
    deliveryFee: 500,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    confirmationMethod: 'PHOTO'
  }
];

// Orders for another driver, to show filtering works
const driver2Orders: Order[] = [
    {
        id: "ORD-201",
        driverId: "DRV-002",
        items: generateItems(1),
        status: 'Delivered',
        pickup: { address: "Tamale", coords: ghanaLocations["Tamale"] },
        destination: { address: "Wa", coords: ghanaLocations["Wa"] },
        recipientName: "Distributor - Wa",
        recipientPhone: "0233999888",
        paymentType: 'Prepaid',
        deliveryFee: 500,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        confirmationMethod: 'SIGNATURE'
    }
];

// Generate more random orders for filler
const otherOrders = Array.from({ length: 10 }, (_, i) => {
    const id = `ORD-3${String(i).padStart(2, '0')}`;
    const driverId = `DRV-00${3 + (i % 3)}`;
    return {
        id,
        driverId,
        items: generateItems(1),
        status: 'Delivered' as Order['status'],
        pickup: getRandomLocation(),
        destination: getRandomLocation(),
        recipientName: recipientNames[i % recipientNames.length],
        recipientPhone: `05012345${i < 10 ? '0' : ''}${i}`,
        paymentType: 'Prepaid' as Order['paymentType'],
        deliveryFee: 500,
        completedAt: new Date(Date.now() - (i + 4) * 24 * 60 * 60 * 1000).toISOString(),
        confirmationMethod: 'OTP' as Order['confirmationMethod'],
    };
});


export const mockOrders: Order[] = [...driver1Orders, ...driver2Orders, ...otherOrders];
