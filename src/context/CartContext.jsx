import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../services/api';
import { getSessionId } from '../utils/session';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_CART':
      return { ...state, cart: { items: [], totalItems: 0, totalAmount: 0 } };
    default:
      return state;
  }
};

const initialState = {
  cart: { items: [], totalItems: 0, totalAmount: 0 },
  loading: false,
  error: null,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const sessionId = getSessionId();

  const fetchCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await api.get(`/cart/${sessionId}`);
      dispatch({ type: 'SET_CART', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [sessionId]);

  const addItem = useCallback(
    async (productId, quantity = 1, productInfo) => {
      dispatch({ type: 'CLEAR_ERROR' });
      try {
        const res = await api.post(`/cart/${sessionId}/items`, {
          productId,
          quantity,
        });
        dispatch({ type: 'SET_CART', payload: res.data.data });
        if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('cart:item-added', {
              detail: { product: productInfo || null },
            })
          );
        }
        return true;
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return false;
      }
    },
    [sessionId]
  );

  const updateItem = useCallback(
    async (itemId, quantity) => {
      dispatch({ type: 'CLEAR_ERROR' });
      try {
        const res = await api.patch(`/cart/${sessionId}/items/${itemId}`, {
          quantity,
        });
        dispatch({ type: 'SET_CART', payload: res.data.data });
        return true;
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return false;
      }
    },
    [sessionId]
  );

  const removeItem = useCallback(
    async (itemId) => {
      dispatch({ type: 'CLEAR_ERROR' });
      try {
        const res = await api.delete(`/cart/${sessionId}/items/${itemId}`);
        dispatch({ type: 'SET_CART', payload: res.data.data });
        return true;
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
        return false;
      }
    },
    [sessionId]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value = {
    ...state,
    sessionId,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
