
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
  quantity: number;
  status: 'Pending' | 'Moving' | 'Idle' | 'Returning' | 'Delivered' | 'Cancelled';
  
  pickup: Location;
  destination: Location;

  recipientName: string;
  recipientPhone: string;
  requestedDeliveryTime?: string; // e.g., "2024-07-18T14:00:00Z"
  productPrice?: number;
  completedAt?: string; // Timestamp for when the order was delivered or cancelled
  returnReason?: string; // Reason for the return

  // Defines what the driver needs to collect upon delivery
  confirmationMethod: 'PHOTO' | 'SIGNATURE' | 'OTP';
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
  problemCode: 'BT' | 'MF' | 'FS' | 'SOS' | 'TR' | 'NP' | 'AC' | 'PD' | 'BW' | 'CU' | 'SC' | 'OK';
};
