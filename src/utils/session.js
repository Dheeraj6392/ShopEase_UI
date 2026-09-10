const CART_SESSION_KEY = 'shopease_cart_session';

export const getSessionId = () => {
  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
};
