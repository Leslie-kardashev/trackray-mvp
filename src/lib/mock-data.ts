
import { type Order, type OrderItem } from './types';

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

const itemBases: Omit<OrderItem, 'quantity'>[] = [
    { name: "Nestlé Milo", unit: "Cases", unitPrice: 150 },
    { name: "Gino Tomato Mix", unit: "Boxes", unitPrice: 80, specifics: "400g Tins" },
    { name: "Cowbell Milk Powder", unit: "Sacks", unitPrice: 500 },
    { name: "Frytol Cooking Oil", unit: "Cartons", unitPrice: 220, specifics: "5L Bottles" },
    { name: "Ideal Milk", unit: "Pallets", unitPrice: 1200 },
    { name: "Indomie Noodles", unit: "Boxes", unitPrice: 95, specifics: "Chicken Flavour" },
    { name: "Omo Detergent", unit: "Sacks", unitPrice: 300, specifics: "10kg" },
    { name: "Club Beer", unit: "Cases", unitPrice: 180 },
    { name: "Coca-Cola", unit: "Crates", unitPrice: 100, specifics: "350ml Glass" },
    { name: "Royal Aroma Rice", unit: "Bags", unitPrice: 450, specifics: "Grade A, 25kg" }
];

const recipientNames = [
    "Shoprite Accra Mall", "Melcome Shop", "MaxMart - 37",
    "Palace Supermarket", "Koala Shopping Center", "CityDia - Tema",
    "Distributor - Koforidua", "Wholesale Supply - Takoradi", "Jumia Warehouse", "Local Market - Tamale"
];

const generateItems = (count: number): OrderItem[] => {
    const items = new Set<OrderItem>();
    const usedIndices = new Set<number>();
    while (items.size < count) {
        const itemIndex = Math.floor(Math.random() * itemBases.length);
        if (usedIndices.has(itemIndex)) continue;

        const itemBase = itemBases[itemIndex];
        const quantity = Math.floor(Math.random() * 40) + 10; // 10 to 50
        items.add({ ...itemBase, quantity });
        usedIndices.add(itemIndex);
    }
    return Array.from(items);
};

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

// A structured set of orders for DRV-001 to ensure a clear demo flow
const driver1Orders: Order[] = [
  // 1. The active order - approaching deadline
  {
    id: "ORD-101",
    driverId: "DRV-001",
    items: generateItems(1),
    status: 'Moving',
    pickup: { address: "Accra", coords: ghanaLocations["Accra"] },
    destination: { address: "Tema", coords: ghanaLocations["Tema"] },
    recipientName: "CityDia - Tema",
    recipientPhone: "0302111222",
    createdAt: hoursAgo(30), // 30 hours ago
    paymentType: 'Pay on Credit',
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
    createdAt: hoursAgo(10), // On schedule
    paymentType: 'Prepaid',
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
    createdAt: hoursAgo(40), // High priority
    paymentType: 'Pay on Credit',
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
    createdAt: hoursAgo(72),
    paymentType: 'Prepaid',
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
    createdAt: hoursAgo(90),
    paymentType: 'Pay on Credit',
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
    createdAt: hoursAgo(100),
    paymentType: 'Prepaid',
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
        createdAt: hoursAgo(50),
        paymentType: 'Prepaid',
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
        createdAt: hoursAgo(i*5 + 48),
        paymentType: 'Prepaid' as Order['paymentType'],
        completedAt: new Date(Date.now() - (i + 4) * 24 * 60 * 60 * 1000).toISOString(),
        confirmationMethod: 'OTP' as Order['confirmationMethod'],
    };
});


export const mockOrders: Order[] = [...driver1Orders, ...driver2Orders, ...otherOrders];
