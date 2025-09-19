
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

// Function to generate a random list of items for an order
const generateItems = (count: number): string[] => {
    const items = new Set<string>();
    while (items.size < count) {
        const itemBase = itemBases[Math.floor(Math.random() * itemBases.length)];
        const quantity = Math.floor(Math.random() * 50) + 5;
        items.add(`${quantity} ${itemBase.unit} of ${itemBase.product}`);
    }
    return Array.from(items);
};


export const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => {
  const id = `ORD-${101 + i}`;
  const pickup = getRandomLocation();
  let destination = getRandomLocation();
  while (destination.address === pickup.address) {
    destination = getRandomLocation();
  }
  
  const completedStatuses: Order['status'][] = ['Delivered', 'Returning', 'Cancelled'];
  let status: Order['status'];
  
  // Assign driver and set status logic
  const driverId = (i % 4 === 0) ? 'DRV-002' : 'DRV-001'; // Assign to different drivers
  
  // Make the data generation deterministic and logical for the demo
  if (driverId === 'DRV-001') {
      if (i === 1) { // This is ORD-102 for DRV-001, make it the active one
          status = 'Moving';
      } else if (i > 1 && i < 7) { // The next few orders are pending
          status = 'Pending';
      } else { // The rest are completed
          status = completedStatuses[i % completedStatuses.length];
      }
  } else {
      // All orders for the other driver are completed or pending for simplicity
       if (i === 0) { // ORD-101 for DRV-002
           status = 'Pending';
       } else {
           status = 'Delivered';
       }
  }

  const paymentTypes: Order['paymentType'][] = ['Prepaid', 'Pay on Delivery'];
  const paymentType = paymentTypes[i % paymentTypes.length];


  const confirmationMethods: Order['confirmationMethod'][] = ['PHOTO', 'SIGNATURE', 'OTP'];

  let completedAt: string | undefined = undefined;
  if (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') {
      const date = new Date();
      date.setDate(date.getDate() - (i % 10)); // Stagger completion dates
      completedAt = date.toISOString();
  }

  // Generate single or bundled items
  const itemCount = (i % 5 === 2) ? 3 : (i % 5 === 4) ? 2 : 1; // Create some bundled orders
  const items = generateItems(itemCount);
  
  const deliveryFee = destination.address === 'Kumasi' ? 0 : 500;
  
  let productPrice;
  if (paymentType === 'Pay on Delivery') {
    productPrice = Math.floor(Math.random() * 1000) + 50;
  }


  return {
    id,
    driverId: driverId,
    items,
    status,
    pickup,
    destination,
    recipientName: recipientNames[i % recipientNames.length],
    recipientPhone: `0${Math.floor(200000000 + Math.random() * 100000000)}`,
    requestedDeliveryTime: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 3).toISOString(),
    confirmationMethod: confirmationMethods[i % confirmationMethods.length],
    productPrice,
    deliveryFee,
    paymentType,
    completedAt,
    returnReason: status === 'Returning' ? 'Customer Refused' : undefined,
    returnPhotoUrl: status === 'Returning' ? `/returns/${id}-photo.jpg` : undefined
  };
});
