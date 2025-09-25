

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
  status: 'In Stock' | 'Inbound' | 'Outbound' | 'Low Stock';
  lastUpdated: string;
  unitCost: number;
  minThreshold: number;
  category: string;
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

export type Driver = {
    id: string;
    name: string;
    vehicleId: string;
    vehicleType: 'Motorbike' | 'Standard Cargo Van' | 'Heavy Duty Truck';
    status: 'Available' | 'On-trip' | 'Offline';
    phone: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
}

export type Order = {
  id: string;
  customerId: string; // Link to Customer
  customerName: string;
  items: OrderItem[];
  status: 'Pending' | 'Confirmed' | 'Ready for Dispatch' | 'Delivered' | 'Cancelled' | 'Archived';
  paymentStatus: 'Paid' | 'Pay on Credit' | 'Pending';
  pickup: Location;
  destination: Location;
  orderDate: string;
  scheduledPickupTime?: string; // e.g., "2024-05-25T14:00:00Z"
  currentLocation: { lat: number, lng: number } | null;
  routeColor?: string;
  orderValue?: number;
  deliveryTime?: string;
  specialInstructions?: string;
  driverId?: string | null;
  driverName?: string | null;
  driverVehicleId?: string | null;
  priorityScore: number;
};

export type SOSMessage = {
  id: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  message: string;
  location?: string;
};

export type Complaint = {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  complaintType: 'Lateness' | 'Damaged Item' | 'Driver Conduct' | 'Billing Issue' | 'Other';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  timestamp: string;
};
