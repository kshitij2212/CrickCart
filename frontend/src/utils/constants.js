export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
};

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const PAYMENT_METHODS = {
  COD: 'COD',
  CARD: 'Card',
  UPI: 'UPI',
  WALLET: 'Wallet',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';