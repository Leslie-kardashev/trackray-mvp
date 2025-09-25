
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { User, Product, CartItem, Order, ProductVariant } from '@/lib/types';
=======
import { User, Product, CartItem, Order } from '@/lib/types';
>>>>>>> 95ac1cf (Good Start)
import { mockUsers, mockProducts, mockOrders } from '@/lib/mock-data';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  products: Product[];
  cart: CartItem[];
<<<<<<< HEAD
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
=======
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
>>>>>>> 95ac1cf (Good Start)
  clearCart: () => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'userId' | 'orderDate' >) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  products: [],
  cart: [],
  addToCart: () => {},
  updateCartQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  orders: [],
  placeOrder: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    // On initial load, check if user is in localStorage
    const storedUser = localStorage.getItem('thonket-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setOrders(mockOrders.filter(o => o.userId === parsedUser.id));
    }
    setProducts(mockProducts);
  }, []);

  const login = (loggedInUser: User) => {
    // In a real app, you'd validate against a backend
    const foundUser = mockUsers.find(u => u.email === loggedInUser.email);
    if(foundUser){
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password
      
      localStorage.setItem('thonket-user', JSON.stringify(userToStore));
      setUser(userToStore);
      setOrders(mockOrders.filter(o => o.userId === userToStore.id));
      router.push('/customer/dashboard');
    } else {
        // Handle new user registration
         const userToStore = { ...loggedInUser };
         delete userToStore.password;
         localStorage.setItem('thonket-user', JSON.stringify(userToStore));
         setUser(userToStore);
         setOrders([]); // New user has no orders yet
         router.push('/customer/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('thonket-user');
    setUser(null);
    setCart([]);
    setOrders([]);
    router.push('/customer/login');
  };

<<<<<<< HEAD
  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    if (quantity <= 0) return;
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id && item.variant?.id === variant?.id
=======
  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
>>>>>>> 95ac1cf (Good Start)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
<<<<<<< HEAD
      return [...prevCart, { product, quantity, variant }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId && item.variant?.id === variantId
            ? { ...item, quantity }
            : item
=======
      return [...prevCart, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
>>>>>>> 95ac1cf (Good Start)
        )
      );
    }
  };

<<<<<<< HEAD
  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === productId && item.variant?.id === variantId)
      )
    );
=======
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
>>>>>>> 95ac1cf (Good Start)
  };
  
  const clearCart = () => {
    setCart([]);
  }

  const placeOrder = (newOrderData: Omit<Order, 'id' | 'userId' | 'orderDate' >) => {
    if (!user) return;

    const newOrder: Order = {
        ...newOrderData,
        id: `ord-${Date.now()}`,
        userId: user.id,
        orderDate: new Date().toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        products,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        orders,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
