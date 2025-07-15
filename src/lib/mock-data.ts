import { type InventoryItem, type Order } from './types';

export const mockInventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Cocoa Beans (Grade A)', quantity: 50, status: 'In Stock', lastUpdated: '2024-05-20' },
  { id: 'ITM-002', name: 'Kente Cloth Rolls', quantity: 200, status: 'In Stock', lastUpdated: '2024-05-21' },
  { id: 'ITM-003', name: 'Shea Butter Tubs', quantity: 0, status: 'Outbound', lastUpdated: '2024-05-22' },
  { id: 'ITM-004', name: 'Imported Electronics', quantity: 150, status: 'Inbound', lastUpdated: '2024-05-23' },
  { id: 'ITM-005', name: 'Vehicle Spare Parts', quantity: 80, status: 'In Stock', lastUpdated: '2024-05-19' },
];

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

const routeColors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
  '#33FFA1', '#FFC300', '#FF5733', '#C70039', '#900C3F',
  '#581845', '#1B4F72', '#2E86C1', '#17A589', '#229954',
  '#D4AC0D', '#CA6F1E', '#BA4A00', '#A93226', '#884EA0'
];

export const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => {
  const id = `ORD-${101 + i}`;
  const pickup = getRandomLocation();
  let destination = getRandomLocation();
  // Ensure pickup and destination are not the same
  while (destination.address === pickup.address) {
    destination = getRandomLocation();
  }
  const statuses: Order['status'][] = ['Moving', 'Idle', 'Returning', 'Delivered', 'Pending', 'Cancelled'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  let currentLocation: { lat: number, lng: number } | null = null;
  if (status === 'Moving' || status === 'Returning') {
    // Start somewhere between pickup and destination
    currentLocation = {
      lat: pickup.coords.lat + (destination.coords.lat - pickup.coords.lat) * Math.random(),
      lng: pickup.coords.lng + (destination.coords.lng - pickup.coords.lng) * Math.random(),
    };
  } else if (status === 'Idle') {
    // Idle somewhere near pickup
    currentLocation = {
      lat: pickup.coords.lat + (Math.random() - 0.5) * 0.1,
      lng: pickup.coords.lng + (Math.random() - 0.5) * 0.1,
    };
  } else if (status === 'Delivered') {
    currentLocation = destination.coords;
  }

  return {
    id,
    customerName: `Customer ${101 + i}`,
    item: `ITM-00${(i % 5) + 1}`,
    status,
    pickup,
    destination,
    orderDate: `2024-05-${20 + (i % 10)}`,
    currentLocation,
    routeColor: routeColors[i % routeColors.length]
  };
});
