
export type Location = {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
};

export type User = {
  id: string;
  email: string;
  password?: string; // Should not be sent to client
  type: 'Individual' | 'Business';
  fullName?: string;
  businessName?: string;
  businessOwnerName?: string;
  phoneNumbers?: string[];
  shopLocation: Location;
};

export type ProductVariant = {
  id: string;
  name: string; // e.g., "5kg Bag", "Liter Bottle"
  unitPrice: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  unitPrice?: number; // For products without variants
  variants?: ProductVariant[];
  imageUrl: string;
  category: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
};

export type OrderItem = {
  product: Product;
  quantity: number;
  priceAtOrder: number;
  variant?: ProductVariant;
};

export type TrackingStatus = 'Driver Assigned' | 'Moving' | 'Parked' | 'In Traffic' | 'SOS' | 'Inbound' | 'Arriving' | 'Arrived';

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending Assignment' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryAddress: Location;
  orderDate: string; // ISO String
  scheduledDeliveryDate: string; // ISO String
  paymentPreference: 'Prepaid' | 'Pay On Credit';
  // New tracking fields
  trackingStatus?: TrackingStatus;
  currentLocationArea?: string; // e.g., "Adenta"
  trackingProgress?: number; // 0-100
};
