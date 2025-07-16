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

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: Location;
  customerType: 'Retailer' | 'Wholesaler' | 'Other';
  paymentPreference: 'Cash' | 'Credit';
};

export type Order = {
  id: string;
  customerId: string; // Link to Customer
  customerName: string;
  item: string;
  status: 'Pending' | 'Moving' | 'Idle' | 'Returning' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pay on Delivery' | 'Pending';
  pickup: Location;
  destination: Location;
  orderDate: string;
  currentLocation: { lat: number, lng: number } | null;
  routeColor?: string;
  orderValue?: number;
  deliveryTime?: string;
  specialInstructions?: string;
};
