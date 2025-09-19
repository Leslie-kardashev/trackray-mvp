
export type Location = {
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
};

export type Order = {
  id: string; // Document ID from Firestore
  driverId: string; // ID of the assigned driver
  items: string[]; // e.g., ["50 Bags of Lele Rice", "20 Boxes of Indomie"]
  status: 'Pending' | 'Moving' | 'Idle' | 'Returning' | 'Delivered' | 'Cancelled';
  
  pickup: Location;
  destination: Location;

  recipientName: string;
  recipientPhone: string;
  requestedDeliveryTime?: string; // ISO string
  productPrice?: number;
  completedAt?: string; // ISO string
  returnReason?: string; // Reason for the return
  returnPhotoUrl?: string; // URL to the photo of the returned item

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
