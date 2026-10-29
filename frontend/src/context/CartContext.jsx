import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('retro_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('retro_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    if (!selectedSize) {
      return { success: false, message: 'Please select a size before adding to cart' };
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const color = selectedColor || (product.colors && product.colors[0]) || 'Standard';

    setCartItems((prevItems) => {
      // Find existing item with exact same product ID, size, and color
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product === product._id &&
          item.size === selectedSize &&
          item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem = {
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          image: (product.images && product.images[0]) || '',
          size: selectedSize,
          color,
          quantity: qty,
          stock: product.stock,
        };
        return [...prevItems, newItem];
      }
    });

    return { success: true, message: `Added "${product.name}" (${selectedSize}) to bag` };
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.product === productId &&
          item.size === size &&
          item.color === color
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('retro_cart');
  };

  // Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 2999;
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 199;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = subtotal + shippingCharge;

  const value = {
    cartItems,
    itemCount,
    subtotal,
    shippingCharge,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
