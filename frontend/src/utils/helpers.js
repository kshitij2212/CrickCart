export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const calculateDiscount = (price, finalPrice) => {
  return Math.round(((price - finalPrice) / price) * 100);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const getOrderStatusColor = (status) => {
  const colors = {
    Pending: 'text-yellow-600 bg-yellow-100',
    Processing: 'text-blue-600 bg-blue-100',
    Shipped: 'text-purple-600 bg-purple-100',
    Delivered: 'text-green-600 bg-green-100',
    Cancelled: 'text-red-600 bg-red-100',
    'Return Requested': 'text-orange-600 bg-orange-100',
    Returned: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};