export type Location = {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  status: 'In Stock' | 'Inbound' | 'Outbound';
  lastUpdated: string;
};

export type Order = {
  id: string;
  customerName: string;
  item: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  pickup: Location;
  destination: Location;
  orderDate: string;
  currentLocation: { lat: number, lng: number } | null;
};
