import { type User, type Product, type Order } from './types';

// In a real app, this data would come from a database.
// For this demo, we're mocking it.

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
    unitPrice: 150.0,
    imageUrl: 'https://picsum.photos/seed/milo/400/300',
    category: 'Beverages',
  },
  {
    id: 'prod-2',
    name: 'Cowbell Milk',
    description: 'Instant milk powder.',
    unitPrice: 500.0,
    imageUrl: 'https://picsum.photos/seed/cowbell/400/300',
    category: 'Dairy',
  },
  {
    id: 'prod-3',
    name: 'Frytol Cooking Oil',
    description: 'Pure vegetable cooking oil.',
    unitPrice: 220.0,
    imageUrl: 'https://picsum.photos/seed/frytol/400/300',
    category: 'Cooking Essentials',
  },
  {
    id: 'prod-4',
    name: 'Gino Tomato Mix',
    description: 'Rich and thick tomato paste.',
    unitPrice: 80.0,
    imageUrl: 'https://picsum.photos/seed/gino/400/300',
    category: 'Cooking Essentials',
  },
  {
    id: 'prod-5',
    name: 'Royal Aroma Rice',
    description: 'Premium long-grain perfumed rice.',
    unitPrice: 450.0,
    imageUrl: 'https://picsum.photos/seed/rice/400/300',
    category: 'Grains',
  },
  {
    id: 'prod-6',
    name: 'Ideal Milk',
    description: 'Evaporated milk for cereals and tea.',
    unitPrice: 5.5,
    imageUrl: 'https://picsum.photos/seed/ideal/400/300',
    category: 'Dairy',
  },
  {
    id: 'prod-7',
    name: 'Indomie Instant Noodles',
    description: 'Quick and tasty chicken flavor noodles.',
    unitPrice: 95.0,
    imageUrl: 'https://picsum.photos/seed/indomie/400/300',
    category: 'Pantry',
  },
  {
    id: 'prod-8',
    name: 'Omo Detergent',
    description: 'Tough stain removal for laundry.',
    unitPrice: 30.0,
    imageUrl: 'https://picsum.photos/seed/omo/400/300',
    category: 'Household',
  },
];

export const mockOrders: Order[] = [
    {
        id: 'ord-123',
        userId: 'user-2',
        items: [
            { product: mockProducts[0], quantity: 2, priceAtOrder: 150.00 },
            { product: mockProducts[4], quantity: 1, priceAtOrder: 450.00 },
        ],
        totalAmount: 750.00,
        status: 'Out for Delivery',
        deliveryAddress: {
            address: '789 Osu Oxford Street, Accra, Ghana',
            coords: { lat: 5.558, lng: -0.186 }
        },
        orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
    },
    {
        id: 'ord-124',
        userId: 'user-1',
        items: [
            { product: mockProducts[2], quantity: 1, priceAtOrder: 220.00 },
        ],
        totalAmount: 220.00,
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
            { product: mockProducts[6], quantity: 10, priceAtOrder: 95.0 },
        ],
        totalAmount: 950.00,
        status: 'Pending Assignment',
        deliveryAddress: {
            address: 'Melcome Shop, Kumasi',
            coords: { lat: 6.688, lng: -1.624 }
        },
        orderDate: new Date().toISOString(),
        scheduledDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentPreference: 'Pay On Credit',
    }
];
