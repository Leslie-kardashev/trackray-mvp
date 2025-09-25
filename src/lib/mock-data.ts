import { type User, type Product, type Order } from './types';

<<<<<<< HEAD
import { type User, type Product, type Order } from './types';
import placeholderImages from '@/app/lib/placeholder-images.json';

// In a real app, this data would come from a database.
// For this demo, we're mocking it.

=======
// In a real app, this data would come from a database.
// For this demo, we're mocking it.

>>>>>>> 95ac1cf (Good Start)
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'individual@test.com',
    password: 'password', // Don't do this in production!
    type: 'Individual',
    fullName: 'Ama Badu',
    phoneNumbers: ['0244123456'],
    shopLocation: {
      address: '123 Adabraka St, Accra, Ghana',
      coords: { lat: 5.559, lng: -0.206 },
    },
  },
  {
    id: 'user-2',
    email: 'business@test.com',
    password: 'password',
    type: 'Business',
    businessName: 'Melcome Shop',
    businessOwnerName: 'Kwame Mensah',
    phoneNumbers: ['0302987654', '0208112233'],
    shopLocation: {
      address: '789 Osu Oxford Street, Accra, Ghana',
      coords: { lat: 5.558, lng: -0.186 },
    },
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Nestlé Milo',
    description: 'Rich chocolate malt beverage.',
<<<<<<< HEAD
    variants: [
        { id: 'milo-400', name: '400g Tin', unitPrice: 45.00 },
        { id: 'milo-900', name: '900g Tin', unitPrice: 90.00 },
    ],
    imageUrl: placeholderImages.milo.url,
=======
    unitPrice: 150.0,
    imageUrl: 'https://picsum.photos/seed/milo/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Beverages',
  },
  {
    id: 'prod-2',
    name: 'Cowbell Milk',
    description: 'Instant milk powder.',
<<<<<<< HEAD
    variants: [
        { id: 'cowbell-sachet', name: 'Sachet', unitPrice: 5.00 },
        { id: 'cowbell-400', name: '400g Tin', unitPrice: 50.00 },
    ],
    imageUrl: placeholderImages.cowbell.url,
=======
    unitPrice: 500.0,
    imageUrl: 'https://picsum.photos/seed/cowbell/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Dairy',
  },
  {
    id: 'prod-3',
    name: 'Frytol Cooking Oil',
    description: 'Pure vegetable cooking oil.',
<<<<<<< HEAD
    variants: [
        { id: 'frytol-1l', name: '1L Bottle', unitPrice: 65.00 },
        { id: 'frytol-5l', name: '5L Gallon', unitPrice: 300.00 },
    ],
    imageUrl: placeholderImages.frytol.url,
=======
    unitPrice: 220.0,
    imageUrl: 'https://picsum.photos/seed/frytol/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Cooking Essentials',
  },
  {
    id: 'prod-4',
    name: 'Gino Tomato Mix',
    description: 'Rich and thick tomato paste.',
<<<<<<< HEAD
    unitPrice: 5.00,
    imageUrl: placeholderImages.gino.url,
=======
    unitPrice: 80.0,
    imageUrl: 'https://picsum.photos/seed/gino/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Cooking Essentials',
  },
  {
    id: 'prod-5',
    name: 'Royal Aroma Rice',
    description: 'Premium long-grain perfumed rice.',
<<<<<<< HEAD
    variants: [
        { id: 'rice-5kg', name: '5kg Bag', unitPrice: 150.00 },
        { id: 'rice-10kg', name: '10kg Bag', unitPrice: 280.00 },
        { id: 'rice-25kg', name: '25kg Bag', unitPrice: 650.00 },
    ],
    imageUrl: placeholderImages.rice.url,
=======
    unitPrice: 450.0,
    imageUrl: 'https://picsum.photos/seed/rice/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Grains',
  },
  {
    id: 'prod-6',
    name: 'Ideal Milk',
    description: 'Evaporated milk for cereals and tea.',
    unitPrice: 5.5,
<<<<<<< HEAD
    imageUrl: placeholderImages.ideal.url,
=======
    imageUrl: 'https://picsum.photos/seed/ideal/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Dairy',
  },
  {
    id: 'prod-7',
    name: 'Indomie Instant Noodles',
    description: 'Quick and tasty chicken flavor noodles.',
<<<<<<< HEAD
    unitPrice: 4.00,
    imageUrl: placeholderImages.indomie.url,
=======
    unitPrice: 95.0,
    imageUrl: 'https://picsum.photos/seed/indomie/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Pantry',
  },
  {
    id: 'prod-8',
    name: 'Omo Detergent',
    description: 'Tough stain removal for laundry.',
<<<<<<< HEAD
    unitPrice: 30.00,
    imageUrl: placeholderImages.omo.url,
=======
    unitPrice: 30.0,
    imageUrl: 'https://picsum.photos/seed/omo/400/300',
>>>>>>> 95ac1cf (Good Start)
    category: 'Household',
  },
];

<<<<<<< HEAD

=======
>>>>>>> 95ac1cf (Good Start)
export const mockOrders: Order[] = [
    {
        id: 'ord-123',
        userId: 'user-2',
        items: [
<<<<<<< HEAD
            { product: mockProducts[0], quantity: 2, priceAtOrder: 45.00, variant: mockProducts[0].variants![0] },
            { product: mockProducts[4], quantity: 1, priceAtOrder: 150.00, variant: mockProducts[4].variants![0] },
        ],
        totalAmount: 240.00,
=======
            { product: mockProducts[0], quantity: 2, priceAtOrder: 150.00 },
            { product: mockProducts[4], quantity: 1, priceAtOrder: 450.00 },
        ],
        totalAmount: 750.00,
>>>>>>> 95ac1cf (Good Start)
        status: 'Out for Delivery',
        deliveryAddress: {
            address: '789 Osu Oxford Street, Accra, Ghana',
            coords: { lat: 5.558, lng: -0.186 }
        },
        orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
<<<<<<< HEAD
        trackingStatus: 'Moving',
        currentLocationArea: 'Near Tesano',
        trackingProgress: 45,
    },
    {
        id: 'ord-126',
        userId: 'user-2',
        items: [
            { product: mockProducts[3], quantity: 20, priceAtOrder: 5.00 },
        ],
        totalAmount: 100.00,
        status: 'Out for Delivery',
        deliveryAddress: {
            address: 'Circle, Accra, Ghana',
            coords: { lat: 5.57, lng: -0.20 }
        },
        orderDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Prepaid',
        trackingStatus: 'In Traffic',
        currentLocationArea: 'Achimota Forest',
        trackingProgress: 30,
    },
    {
        id: 'ord-127',
        userId: 'user-1',
        items: [
            { product: mockProducts[7], quantity: 2, priceAtOrder: 30.00 },
        ],
        totalAmount: 60,
        status: 'Out for Delivery',
        deliveryAddress: {
            address: '123 Adabraka St, Accra, Ghana',
            coords: { lat: 5.559, lng: -0.206 }
        },
        orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Prepaid',
        trackingStatus: 'Arriving',
        currentLocationArea: 'ใกล้ Adabraka',
        trackingProgress: 90,
=======
>>>>>>> 95ac1cf (Good Start)
    },
    {
        id: 'ord-124',
        userId: 'user-1',
        items: [
<<<<<<< HEAD
            { product: mockProducts[2], quantity: 1, priceAtOrder: 300.00, variant: mockProducts[2].variants![1] },
        ],
        totalAmount: 320.00,
=======
            { product: mockProducts[2], quantity: 1, priceAtOrder: 220.00 },
        ],
        totalAmount: 220.00,
>>>>>>> 95ac1cf (Good Start)
        status: 'Delivered',
        deliveryAddress: {
            address: '123 Adabraka St, Accra, Ghana',
            coords: { lat: 5.559, lng: -0.206 }
        },
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Prepaid',
    },
    {
        id: 'ord-125',
        userId: 'user-2',
        items: [
<<<<<<< HEAD
            { product: mockProducts[6], quantity: 10, priceAtOrder: 4.00 },
        ],
        totalAmount: 40.00,
=======
            { product: mockProducts[6], quantity: 10, priceAtOrder: 95.0 },
        ],
        totalAmount: 950.00,
>>>>>>> 95ac1cf (Good Start)
        status: 'Pending Assignment',
        deliveryAddress: {
            address: 'Melcome Shop, Kumasi',
            coords: { lat: 6.688, lng: -1.624 }
        },
<<<<<<< HEAD
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
        trackingStatus: 'Driver Assigned',
        trackingProgress: 5,
    },
    {
        id: 'ord-128',
        userId: 'user-2',
        items: [
            { product: mockProducts[1], quantity: 5, priceAtOrder: 50.00, variant: mockProducts[1].variants![1] },
        ],
        totalAmount: 250.00,
        status: 'Out for Delivery',
        deliveryAddress: {
            address: 'East Legon, Accra, Ghana',
            coords: { lat: 5.63, lng: -0.18 }
        },
        orderDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
        trackingStatus: 'SOS',
        currentLocationArea: 'Spintex Road',
        trackingProgress: 40,
    },
     {
        id: 'ord-129',
        userId: 'user-1',
        items: [
            { product: mockProducts[5], quantity: 2, priceAtOrder: 5.50 },
        ],
        totalAmount: 11.00,
        status: 'Cancelled',
        deliveryAddress: {
            address: '123 Adabraka St, Accra, Ghana',
            coords: { lat: 5.559, lng: -0.206 }
        },
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Prepaid',
    },
];

    
=======
        orderDate: new Date().toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
    }
];
>>>>>>> 95ac1cf (Good Start)
