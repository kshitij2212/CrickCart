import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Lock, Truck, Shield, CreditCard, ChevronRight, MapPin, Phone, User, Home, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';

const PAYMENT_METHOD_MAP = {
  card: 'Card',
  upi:  'UPI',
  cod:  'COD',
};

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart, loading } = useCart();
  const { user } = useAuth();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [shippingInfo, setShippingInfo] = useState({
    name:    user?.name || '',
    street:  '',
    city:    '',
    state:   '',
    pincode: '',
    phone:   '',
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiry:     '',
    cvv:        '',
    name:       '',
  });

  const [upiId, setUpiId] = useState('');
  const initCart = useCallback(() => { fetchCart(); }, []);
  useEffect(() => { initCart(); }, [initCart]);

  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery',  time: '3-5 Business Days',      cost: 0,   icon: Package },
    { id: 'express',  name: 'Express Shipping',    time: '1-2 Business Days',      cost: 150, icon: Truck },
    { id: 'nextDay',  name: 'Next Day Air',         time: 'Guaranteed Tomorrow',    cost: 250, icon: Truck },
  ];

  const cartItems  = cart?.items || [];
  const subtotal   = cartItems.reduce((sum, item) => {
    const price = item.product?.finalPrice || item.product?.price || 0;
    return Math.round(sum + price * item.quantity);
  }, 0);
  const shippingCost = shippingOptions.find(opt => opt.id === shippingMethod)?.cost || 0;
  const tax          = Math.round(subtotal * 0.18);
  const total        = subtotal + shippingCost + tax;

  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardInfo(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiry = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    setCardInfo(prev => ({ ...prev, expiry: formatted }));
  };

  const handlePhone = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setShippingInfo(prev => ({ ...prev, phone: raw }));
  };

  const handlePincode = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShippingInfo(prev => ({ ...prev, pincode: raw }));
  };

  const validate = () => {
    const { name, street, city, state, pincode, phone } = shippingInfo;

    if (!name.trim() || !street.trim() || !city.trim() || !state || !pincode || !phone) {
      toast.error('Please fill all shipping details');
      return false;
    }
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!cardInfo.name.trim() || !cardInfo.cardNumber || !cardInfo.expiry || !cardInfo.cvv) {
        toast.error('Please fill all card details');
        return false;
      }
      if (cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
        toast.error('Please enter expiry in MM/YY format');
        return false;
      }
      if (cardInfo.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@paytm)');
        return false;
      }
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    setPaymentProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        orderItems: cartItems.map(item => ({
          product:  item.product.id || item.product._id,
          name:     item.product.name,
          quantity: item.quantity,
          price:    item.product.finalPrice || item.product.price,
          image:    item.product.images?.[0] || '',
        })),
        shippingAddress: {
          name:    shippingInfo.name,
          street:  shippingInfo.street,
          city:    shippingInfo.city,
          state:   shippingInfo.state,
          pincode: shippingInfo.pincode,
          phone:   shippingInfo.phone,
        },
        paymentMethod: PAYMENT_METHOD_MAP[paymentMethod],
        itemsPrice:    subtotal,
        taxPrice:      tax,
        shippingPrice: shippingCost,
        discount:      0,
        totalPrice:    total,
      };

      await orderService.createOrder(orderData);

      await clearCart();

      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8e8]"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-400" />
          </div>
          <h2 className="text-3xl font-black italic text-[#00171f] mb-4">YOUR CART IS EMPTY</h2>
          <p className="text-gray-600 mb-8">Add some elite gear to checkout!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#00a8e8] text-white font-black italic px-8 py-3 rounded-lg hover:bg-[#0095d1] transition-all hover:scale-105"
          >
            SHOP NOW
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-[#00a8e8] transition">Home</button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/cart')} className="hover:text-[#00a8e8] transition">Cart</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#00a8e8] font-bold">Checkout</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic text-[#00171f] mb-2">SECURE CHECKOUT</h1>
          <p className="text-[#00a8e8] font-bold italic flex items-center gap-2">
            <Lock className="w-5 h-5" />
            SSL ENCRYPTED & SECURE
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/20 transition"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#00a8e8]" />
                </div>
                <h2 className="text-2xl font-black italic text-[#00171f] uppercase">SHIPPING ADDRESS</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-full">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                    <User className="w-3 h-3 inline mr-1" /> FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="Virat Kohli"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                    <Home className="w-3 h-3 inline mr-1" /> ADDRESS *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="123 Cricket Stadium Road"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">CITY *</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">STATE *</label>
                  <select
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition text-slate-700"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">PIN CODE *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={shippingInfo.pincode}
                    onChange={handlePincode}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="400001"
                    maxLength="6"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                    <Phone className="w-3 h-3 inline mr-1" /> PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={shippingInfo.phone}
                    onChange={handlePhone}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="9876543210"
                    maxLength="10"
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/20 transition"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#00a8e8]" />
                </div>
                <h2 className="text-2xl font-black italic text-[#00171f] uppercase">DELIVERY METHOD</h2>
              </div>

              <div className="space-y-4">
                {shippingOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-5 cursor-pointer rounded-xl transition-all border-2 ${
                        shippingMethod === option.id
                          ? 'border-[#00a8e8] bg-[#00a8e8]/5 shadow-md'
                          : 'border-slate-200 hover:border-[#00a8e8]/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                          shippingMethod === option.id ? 'border-[#00a8e8]' : 'border-slate-300'
                        }`}>
                          {shippingMethod === option.id && <div className="w-3 h-3 rounded-full bg-[#00a8e8]"></div>}
                        </div>
                        <Icon className={`w-8 h-8 ${shippingMethod === option.id ? 'text-[#00a8e8]' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-black text-base uppercase">{option.name}</p>
                          <p className="text-xs text-slate-600 font-bold">{option.time}</p>
                        </div>
                      </div>
                      <span className={`font-black text-lg ${shippingMethod === option.id ? 'text-[#00a8e8]' : 'text-slate-700'}`}>
                        {option.cost === 0 ? 'FREE' : `₹${option.cost}`}
                      </span>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id)}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/20 transition"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#00a8e8]" />
                </div>
                <h2 className="text-2xl font-black italic text-[#00171f] uppercase">PAYMENT METHOD</h2>
              </div>

              <div className="flex gap-2 mb-6 bg-slate-100 p-2 rounded-xl">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi',  label: 'UPI',               icon: Phone },
                  { id: 'cod',  label: 'Cash on Delivery',  icon: Package },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex-1 py-3 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === id ? 'bg-[#00a8e8] text-white shadow-md' : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  <div className="col-span-full">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">CARDHOLDER NAME</label>
                    <input
                      type="text"
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="VIRAT KOHLI"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">CARD NUMBER</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardInfo.cardNumber}
                        onChange={handleCardNumber}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition pr-12"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00a8e8] w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">EXPIRY DATE</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardInfo.expiry}
                      onChange={handleExpiry}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="•••"
                      maxLength="3"
                    />
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                    placeholder="yourname@paytm"
                  />
                </motion.div>
              )}

              {paymentMethod === 'cod' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-gradient-to-br from-[#00a8e8]/10 to-[#00a8e8]/5 rounded-xl border-2 border-[#00a8e8]/20"
                >
                  <div className="flex items-start gap-3">
                    <Package className="w-6 h-6 text-[#00a8e8] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-black text-[#00171f] mb-1">Cash on Delivery Available</p>
                      <p className="text-sm text-slate-600">
                        Pay <span className="font-black text-[#00a8e8]">₹{total}</span> in cash when your order is delivered.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          </div>

          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-6"
            >
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-2xl border-2 border-slate-100">
                <h2 className="text-2xl font-black italic uppercase text-[#00171f] mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#00a8e8]" />
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2">
                  {cartItems.map((item) => {
                    const product    = item.product || {};
                    const finalPrice = product.finalPrice || product.price || 0;
                    const imgSrc     = product.images?.[0] || null;
                    return (
                      <div key={item._id} className="flex gap-3 pb-4 border-b border-slate-100">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                          {imgSrc
                            ? <img src={imgSrc} alt={product.name || 'Product'} className="w-full h-full object-cover" />
                            : <Package className="w-8 h-8 text-slate-300" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm uppercase line-clamp-2 text-[#00171f]">
                            {product.name || 'Product'}
                          </h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs bg-[#00a8e8]/10 text-[#00a8e8] px-2 py-1 rounded-lg font-black">
                              QTY: {item.quantity}
                            </span>
                            <span className="font-black text-[#00a8e8] text-lg">
                              ₹{Math.round(finalPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 py-6 border-y-2 border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 uppercase font-bold">Subtotal</span>
                    <span className="font-black text-[#00171f]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 uppercase font-bold">Shipping</span>
                    <span className="font-black text-[#00a8e8]">
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 uppercase font-bold">GST (18%)</span>
                    <span className="font-black text-[#00171f]">₹{tax}</span>
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center mb-6">
                  <span className="text-base font-black uppercase text-slate-600">TOTAL</span>
                  <span className="text-5xl font-black text-[#00a8e8] tracking-tight">₹{total}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-[#00a8e8] to-[#0095d1] text-white py-5 rounded-xl font-black italic uppercase text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Lock className="w-5 h-5" />
                  COMPLETE ORDER
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: Lock,   label: 'SSL Secured' },
                    { icon: Shield, label: 'Verified' },
                    { icon: Truck,  label: 'Fast Delivery' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center text-slate-400 hover:text-[#00a8e8] transition">
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-[8px] font-black uppercase text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-center text-slate-500 mt-6 leading-relaxed px-2">
                  By completing this order, you agree to CrickCart's{' '}
                  <span className="font-bold text-[#00a8e8]">Terms of Service</span> and{' '}
                  <span className="font-bold text-[#00a8e8]">Privacy Policy</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#00a8e8]" />
              </div>
              <div>
                <h3 className="font-black italic text-xl text-[#00171f]">DEMO PAYMENT</h3>
                <p className="text-xs text-gray-400">Simulated — no real money</p>
              </div>
            </div>

            <div className="bg-[#00a8e8]/5 border border-[#00a8e8]/20 rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-[#00a8e8] uppercase tracking-widest mb-1">Amount to Pay</p>
              <p className="text-4xl font-black text-[#00171f]">₹{total}</p>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-500">
              {/* FIX: removed fake order ID — real ID is assigned by backend after creation */}
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className="font-bold text-[#00171f] uppercase">{PAYMENT_METHOD_MAP[paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-bold text-[#00171f]">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold text-green-500">DEMO MODE</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-black italic text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handlePaymentConfirm}
                disabled={paymentProcessing}
                className="flex-1 py-3 bg-[#00a8e8] text-white rounded-xl font-black italic hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    PAY ₹{total}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Checkout;