

export type Location = {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
};

export type Order = {
  id: string; // e.g., "ORD-123"
  itemDescription: string; // e.g., "20 boxes of Grade A Cocoa Beans"
  status: 'Assigned' | 'En Route' | 'Delivered' | 'Cancelled';
  
  pickup: Location;
  destination: Location;

  recipientName: string;
  recipientPhone: string;

  // Defines what the driver needs to collect upon delivery
  confirmationMethod: 'PHOTO' | 'SIGNATURE' | 'OTP';

  // Fields from your Django API can be added here
  // For example:
  // estimatedDeliveryTime: string;
  // specialInstructions?: string;
  // orderValue?: number;
};

// This represents the data payload for confirming a delivery
export type DeliveryConfirmation = {
  orderId: string;
  status: 'Delivered';
  confirmationData: string; // Base64 string for photo/signature, or the OTP string
  timestamp: string;
}

export type SOSMessage = {
  id: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  message: string;
  location?: string;
};
