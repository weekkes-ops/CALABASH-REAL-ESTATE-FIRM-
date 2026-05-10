import React, { createContext, useContext, useState, useEffect } from 'react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  image_url: string;
  type: string;
}

interface CartContextType {
  cartItems: Property[];
  addToCart: (property: Property) => void;
  removeFromCart: (propertyId: number) => void;
  clearCart: () => void;
  isInCart: (propertyId: number) => boolean;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Property[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (property: Property) => {
    setCartItems(prev => {
      if (prev.some(item => item.id === property.id)) return prev;
      return [...prev, property];
    });
  };

  const removeFromCart = (propertyId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== propertyId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (propertyId: number) => {
    return cartItems.some(item => item.id === propertyId);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      isInCart, 
      cartCount, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
