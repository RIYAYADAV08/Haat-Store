"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";

const StoreContext = createContext(null);
const STORAGE_KEY = "haat-store-v1";

const initialState = { cart: [], wishlist: [] };

// All cart / wishlist changes go through this one reducer,
// which keeps the logic in one place and easy to test.
function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_TO_CART": {
      const { item, qty } = action;
      const exists = state.cart.find((c) => c.id === item.id);
      const cart = exists
        ? state.cart.map((c) =>
            c.id === item.id ? { ...c, qty: Math.min(c.qty + qty, c.stock) } : c
          )
        : [...state.cart, { ...item, qty: Math.min(qty, item.stock) }];
      return { ...state, cart };
    }

    case "SET_QTY": {
      const cart = state.cart
        .map((c) => (c.id === action.id ? { ...c, qty: Math.min(action.qty, c.stock) } : c))
        .filter((c) => c.qty > 0);
      return { ...state, cart };
    }

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((c) => c.id !== action.id) };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "TOGGLE_WISHLIST": {
      const has = state.wishlist.includes(action.id);
      return {
        ...state,
        wishlist: has
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Load saved cart after first render (localStorage doesn't exist on the server)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch {
      /* ignore broken data */
    }
    setHydrated(true);
  }, []);

  // Save on every change, but only after we've loaded, so we don't overwrite saved data
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state, hydrated]);

  const cartCount = state.cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = state.cart.reduce((sum, c) => sum + c.qty * c.price, 0);

  const value = {
    cart: state.cart,
    wishlist: state.wishlist,
    cartCount,
    cartTotal,
    addToCart: (item, qty = 1) => dispatch({ type: "ADD_TO_CART", item, qty }),
    setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
    removeFromCart: (id) => dispatch({ type: "REMOVE_FROM_CART", id }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleWishlist: (id) => dispatch({ type: "TOGGLE_WISHLIST", id }),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
