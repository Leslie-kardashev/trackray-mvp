
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

const itemDescriptions = [
    "Cases of Nestlé Milo", "Boxes of Gino Tomato Mix", "Sacks of Cowbell Milk Powder", 
    "Cartons of Frytol Cooking Oil", "Pallets of Ideal Milk", "Boxes of Indomie Noodles",
    "Sacks of Omo Detergent", "Cases of Club Beer", "Crates of Coca-Cola", "Bags of Royal Aroma Rice"
];

const recipientNames = [
    "Shoprite Accra Mall", "Melcom Plus - Kumasi", "MaxMart - 37",
    "Palace Supermarket", "Koala Shopping Center", "CityDia - Tema",
    "Distributor - Koforidua", "Wholesale Supply - Takoradi", "Jumia Warehouse", "Local Market - Tamale"
];

export const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => {
  const id = `ORD-${101 + i}`;
  const pickup = getRandomLocation();
  let destination = getRandomLocation();
  while (destination.address === pickup.address) {
    destination = getRandomLocation();
  }
  
  const statuses: Order['status'][] = ['Pending', 'Moving', 'Delivered', 'Returning', 'Cancelled'];
  let status: Order['status'];
  if (i < 2) {
    status = 'Moving'; // Ensure at least one is active
  } else if (i < 5) {
    status = 'Pending';
  } else if (i < 15) {
    status = 'Delivered';
  } else {
    status = statuses[Math.floor(Math.random() * statuses.length)];
  }

  const confirmationMethods: Order['confirmationMethod'][] = ['PHOTO', 'SIGNATURE', 'OTP'];

  let completedAt: string | undefined = undefined;
  if (status === 'Delivered' || status === 'Cancelled' || status === 'Returning') {
      const date = new Date();
      date.setDate(date.getDate() - (i % 10)); // Stagger completion dates
      completedAt = date.toISOString();
  }

  const driverId = (i % 3 === 0) ? 'DRV-002' : 'DRV-001'; // Assign to different drivers

  return {
    id,
    driverId: driverId,
    itemDescription: itemDescriptions[i % itemDescriptions.length],
    quantity: Math.floor(Math.random() * 50) + 5,
    status,
    pickup,
    destination,
    recipientName: recipientNames[i % recipientNames.length],
    recipientPhone: `0${Math.floor(200000000 + Math.random() * 100000000)}`,
    requestedDeliveryTime: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 3).toISOString(),
    confirmationMethod: confirmationMethods[i % confirmationMethods.length],
    productPrice: status === 'Pending' ? Math.floor(Math.random() * 1000) + 50 : undefined,
    completedAt,
    returnReason: status === 'Returning' ? 'Customer Refused' : undefined,
    returnPhotoUrl: status === 'Returning' ? `/returns/${id}-photo.jpg` : undefined
  };
});
