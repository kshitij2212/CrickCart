import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import {
    Lock, Truck, Shield, CreditCard, ChevronRight, MapPin,
    Phone, User, Home, Package, Plus, Check, Trash2, Star, Copy,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import addressService from '../services/addressService';
import api from '../services/api';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PAYMENT_METHOD_MAP = { online: 'Card', cod: 'COD' };

const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
    'Ladakh','Lakshadweep','Puducherry',
];

const EMPTY_ADDRESS_FORM = {
    name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false
};

const Checkout = () => {
    const navigate  = useNavigate();
    const { cart, fetchCart, clearCart, loading } = useCart();
    const { user }  = useAuth();

    const [savedAddresses,   setSavedAddresses]   = useState([]);
    const [selectedAddrId,   setSelectedAddrId]   = useState(null);
    const [showNewAddrForm,  setShowNewAddrForm]   = useState(true); 
    const [newAddrForm,      setNewAddrForm]       = useState(EMPTY_ADDRESS_FORM);
    const [addrLoading,      setAddrLoading]       = useState(false);
    const [savingAddr,       setSavingAddr]        = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('Preparing your order...');
    const [shippingMethod,    setShippingMethod]    = useState('standard');
    const [paymentMethod,     setPaymentMethod]     = useState('online');

    const initCart = useCallback(() => { fetchCart(); }, []);
    useEffect(() => { initCart(); }, [initCart]);

    useEffect(() => {
        const loadAddresses = async () => {
            setAddrLoading(true);
            try {
                const res = await addressService.getAddresses();
                const addrs = res.data || [];
                setSavedAddresses(addrs);
                const def = addrs.find(a => a.isDefault) || addrs[0];
                if (def) setSelectedAddrId(def._id);
                if (addrs.length > 0) setShowNewAddrForm(false);
            } catch (err){
                console.log(err);
            } finally {
                setAddrLoading(false);
            }
        };
        loadAddresses();
    }, []);

    const shippingOptions = [
        { id: 'standard', name: 'Standard Delivery', time: '3-5 Business Days', cost: 0,   icon: Package },
        { id: 'express',  name: 'Express Shipping',  time: '1-2 Business Days', cost: 150, icon: Truck   },
        { id: 'nextDay',  name: 'Next Day Air',       time: 'Guaranteed Tomorrow', cost: 250, icon: Truck },
    ];

    const cartItems    = cart?.items || [];
    const subtotal     = cartItems.reduce((sum, item) => {
        const price = item.product?.finalPrice || item.product?.price || 0;
        return Math.round(sum + price * item.quantity);
    }, 0);
    const shippingCost = shippingOptions.find(o => o.id === shippingMethod)?.cost || 0;
    const tax          = Math.round(subtotal * 0.18);
    const total        = subtotal + shippingCost + tax;



    const handleSaveNewAddress = async () => {
        const { name, phone, street, city, state, pincode } = newAddrForm;
        if (!name.trim() || !phone || !street.trim() || !city.trim() || !state || !pincode) {
            toast.error('Please fill all address fields'); return;
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
            toast.error('Enter a valid 10-digit mobile number'); return;
        }
        if (!/^[1-9][0-9]{5}$/.test(pincode)) {
            toast.error('Enter a valid 6-digit pincode'); return;
        }
        setSavingAddr(true);
        try {
            const res = await addressService.addAddress(newAddrForm);
            const addrs = res.data || [];
            setSavedAddresses(addrs);
            const newest = addrs[addrs.length - 1];
            setSelectedAddrId(newest._id);
            setNewAddrForm(EMPTY_ADDRESS_FORM);
            setShowNewAddrForm(false);
            toast.success('Address saved!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save address');
        } finally {
            setSavingAddr(false);
        }
    };

    const handleDeleteAddress = async (addressId, e) => {
        e.stopPropagation();
        try {
            const res = await addressService.deleteAddress(addressId);
            const addrs = res.data || [];
            setSavedAddresses(addrs);
            if (selectedAddrId === addressId) {
                const def = addrs.find(a => a.isDefault) || addrs[0];
                setSelectedAddrId(def?._id || null);
            }
            if (addrs.length === 0) setShowNewAddrForm(true);
            toast.success('Address removed');
        } catch {
            toast.error('Failed to delete address');
        }
    };

    const validate = () => {
        if (!selectedAddrId) {
            setShowNewAddrForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty'); return false;
        }
        return true;
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text.replace(/ /g, ''));
        toast.success('Card number copied!');
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setPaymentProcessing(true);
        try {
            const selectedAddress = savedAddresses.find(a => a._id === selectedAddrId);

            if (paymentMethod === 'cod') {
                const orderData = {
                    orderItems: cartItems.map(item => ({
                        product:  item.product.id || item.product._id,
                        name:     item.product.name,
                        quantity: item.quantity,
                        price:    item.product.finalPrice || item.product.price,
                        image:    item.product.images?.[0] || '',
                    })),
                    shippingAddress: {
                        name:    selectedAddress.name,
                        street:  selectedAddress.street,
                        city:    selectedAddress.city,
                        state:   selectedAddress.state,
                        pincode: selectedAddress.pincode,
                        phone:   selectedAddress.phone,
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
                toast.success('Order placed successfully!');
                navigate('/orders');
                return;
            }

            const res = await loadRazorpayScript();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            setProcessingMessage('Generating secure payment link...');
            const { data: orderDataRes } = await api.post('/payment/create-order', { amount: total });
            
            if (!orderDataRes.success) {
                toast.error('Server error. Failed to create order.');
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: orderDataRes.order.amount,
                currency: orderDataRes.order.currency,
                name: "CrickCart",
                description: "Test Transaction",
                order_id: orderDataRes.order.id,
                handler: async function (response) {
                    console.log('Razorpay response:', response);
                    setPaymentProcessing(true);
                    setProcessingMessage('Verifying payment & finalizing order...');
                    try {
                        const { data: verifyData } = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyData.success) {
                            const dbOrderData = {
                                orderItems: cartItems.map(item => ({
                                    product:  item.product.id || item.product._id,
                                    name:     item.product.name,
                                    quantity: item.quantity,
                                    price:    item.product.finalPrice || item.product.price,
                                    image:    item.product.images?.[0] || '',
                                })),
                                shippingAddress: {
                                    name:    selectedAddress.name,
                                    street:  selectedAddress.street,
                                    city:    selectedAddress.city,
                                    state:   selectedAddress.state,
                                    pincode: selectedAddress.pincode,
                                    phone:   selectedAddress.phone,
                                },
                                paymentMethod: PAYMENT_METHOD_MAP[paymentMethod],
                                paymentResult: {
                                    id: response.razorpay_payment_id,
                                    status: 'success',
                                    update_time: new Date().toISOString(),
                                    email_address: user?.email || '',
                                },
                                isPaid: true,
                                paidAt: new Date(),
                                itemsPrice:    subtotal,
                                taxPrice:      tax,
                                shippingPrice: shippingCost,
                                discount:      0,
                                totalPrice:    total,
                            };
                            
                            await orderService.createOrder(dbOrderData);
                            await clearCart();
                            toast.success('Order placed!');
                            setPaymentProcessing(false);
                            navigate('/orders');
                        } else {
                            toast.error('Payment Verification Failed!');
                            setPaymentProcessing(false);
                        }
                    } catch (error) {
                            toast.error('Error verifying payment.');
                            setPaymentProcessing(false);
                    }
                },
                prefill: {
                    name: selectedAddress.name,
                    email: user?.email || "test@crickcart.com",
                    contact: selectedAddress.phone,
                },
                theme: {
                    color: "#00a8e8",
                },
                modal: {
                    ondismiss: function() {
                        setPaymentProcessing(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Order error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setPaymentProcessing(false);
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-black italic text-[#00171f] mb-4">YOUR CART IS EMPTY</h2>
                    <p className="text-gray-600 mb-8">Add some elite gear to checkout!</p>
                    <button onClick={() => navigate('/products')}
                        className="bg-[#00a8e8] text-white font-black italic px-8 py-3 rounded-lg hover:bg-[#0095d1] transition-all hover:scale-105">
                        SHOP NOW
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8">
            {paymentProcessing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00171f]/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4 border-2 border-slate-200"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-slate-100 rounded-full blur-xl animate-pulse"></div>
                            <Loader2 className="w-16 h-16 text-[#00171f] animate-spin relative z-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black italic text-[#00171f] mb-2 uppercase tracking-tight">
                                {processingMessage}
                            </h3>
                            <p className="text-slate-500 text-sm font-bold italic">
                                Please do not close this window or refresh the page.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
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
                        <Lock className="w-5 h-5" /> SSL ENCRYPTED & SECURE
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="lg:w-2/3 space-y-6">

                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/20 transition"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-[#00a8e8]" />
                                    </div>
                                    <h2 className="text-2xl font-black italic text-[#00171f] uppercase">DELIVERY ADDRESS</h2>
                                </div>

                                {savedAddresses.length > 0 && savedAddresses.length < 5 && (
                                    <button
                                        onClick={() => setShowNewAddrForm(true)}
                                        className="flex items-center gap-2 text-sm font-black text-[#00a8e8] hover:underline"
                                    >
                                        <Plus className="w-4 h-4" />
                                        ADD NEW
                                    </button>
                                )}
                            </div>

                            {addrLoading ? (
                                <div className="flex justify-center py-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a8e8]"></div>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddrId(addr._id)}
                                            className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                                                selectedAddrId === addr._id
                                                    ? 'border-[#00a8e8] bg-[#00a8e8]/5 shadow-md'
                                                    : 'border-slate-200 hover:border-[#00a8e8]/40'
                                            }`}
                                        >
                                            <div className={`mt-1 w-5 h-5 rounded-full border-4 flex-shrink-0 flex items-center justify-center ${
                                                selectedAddrId === addr._id ? 'border-[#00a8e8]' : 'border-slate-300'
                                            }`}>
                                                {selectedAddrId === addr._id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00a8e8]"></div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-black text-sm uppercase text-[#00171f]">{addr.name}</p>
                                                    {addr.isDefault && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-[#00a8e8]/10 text-[#00a8e8] px-2 py-0.5 rounded-full">
                                                            <Star className="w-2.5 h-2.5" /> DEFAULT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600">{addr.street}, {addr.city}</p>
                                                <p className="text-sm text-slate-600">{addr.state} — {addr.pincode}</p>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {addr.phone}
                                                </p>
                                            </div>

                                            <button
                                                onClick={(e) => handleDeleteAddress(addr._id, e)}
                                                className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <AnimatePresence>
                                {showNewAddrForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t-2 border-slate-100 pt-6 mt-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">NEW ADDRESS</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-full">
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                                        <User className="w-3 h-3 inline mr-1" /> FULL NAME *
                                                    </label>
                                                    <input type="text" value={newAddrForm.name}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, name: e.target.value }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                                                        placeholder="Virat Kohli" />
                                                </div>
                                                <div className="col-span-full">
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                                        <Home className="w-3 h-3 inline mr-1" /> ADDRESS *
                                                    </label>
                                                    <input type="text" value={newAddrForm.street}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, street: e.target.value }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                                                        placeholder="123 Cricket Stadium Road" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">CITY *</label>
                                                    <input type="text" value={newAddrForm.city}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, city: e.target.value }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                                                        placeholder="Mumbai" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">STATE *</label>
                                                    <select value={newAddrForm.state}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, state: e.target.value }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition text-slate-700">
                                                        <option value="">Select State</option>
                                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">PIN CODE *</label>
                                                    <input type="text" inputMode="numeric" value={newAddrForm.pincode}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                                                        placeholder="400001" maxLength="6" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                                        <Phone className="w-3 h-3 inline mr-1" /> PHONE *
                                                    </label>
                                                    <input type="tel" inputMode="numeric" value={newAddrForm.phone}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}
                                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                                                        placeholder="9876543210" maxLength="10" />
                                                </div>
                                                <div className="col-span-full flex items-center gap-2">
                                                    <input type="checkbox" id="isDefault" checked={newAddrForm.isDefault}
                                                        onChange={e => setNewAddrForm(p => ({ ...p, isDefault: e.target.checked }))}
                                                        className="w-4 h-4 accent-[#00a8e8]" />
                                                    <label htmlFor="isDefault" className="text-sm font-bold text-slate-600 cursor-pointer">
                                                        Set as default address
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-5">
                                                {savedAddresses.length > 0 && (
                                                    <button onClick={() => { setShowNewAddrForm(false); setNewAddrForm(EMPTY_ADDRESS_FORM); }}
                                                        className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-black text-slate-600 hover:bg-slate-50 transition text-sm uppercase">
                                                        Cancel
                                                    </button>
                                                )}
                                                <button onClick={handleSaveNewAddress} disabled={savingAddr}
                                                    className="flex-1 py-3 bg-[#00a8e8] text-white rounded-xl font-black uppercase text-sm hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                                    {savingAddr
                                                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
                                                        : <><Check className="w-4 h-4" /> Save Address</>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
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
                                        <label key={option.id}
                                            className={`flex items-center justify-between p-5 cursor-pointer rounded-xl transition-all border-2 ${
                                                shippingMethod === option.id
                                                    ? 'border-[#00a8e8] bg-[#00a8e8]/5 shadow-md'
                                                    : 'border-slate-200 hover:border-[#00a8e8]/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${shippingMethod === option.id ? 'border-[#00a8e8]' : 'border-slate-300'}`}>
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
                                            <input type="radio" name="shipping" checked={shippingMethod === option.id}
                                                onChange={() => setShippingMethod(option.id)} className="hidden" />
                                        </label>
                                    );
                                })}
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/20 transition"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-[#00a8e8]" />
                                </div>
                                <h2 className="text-2xl font-black italic text-[#00171f] uppercase">PAYMENT METHOD</h2>
                            </div>

                            <div className="flex gap-4 mb-6">
                                {[
                                    { id: 'online', label: 'Pay Online', icon: CreditCard },
                                    { id: 'cod',    label: 'Cash on Delivery',      icon: Package },
                                ].map(({ id, label, icon: Icon }) => (
                                    <label key={id}
                                        className={`flex-1 flex flex-col items-center justify-center p-6 cursor-pointer rounded-xl transition-all border-2 ${
                                            paymentMethod === id
                                                ? 'border-[#00a8e8] bg-[#00a8e8]/5 shadow-md'
                                                : 'border-slate-200 hover:border-[#00a8e8]/50'
                                        }`}
                                    >
                                        <Icon className={`w-8 h-8 mb-3 ${paymentMethod === id ? 'text-[#00a8e8]' : 'text-slate-400'}`} />
                                        <span className={`font-black text-sm uppercase text-center ${paymentMethod === id ? 'text-[#00a8e8]' : 'text-slate-600'}`}>{label}</span>
                                        <input type="radio" name="paymentMethod" checked={paymentMethod === id}
                                            onChange={() => setPaymentMethod(id)} className="hidden" />
                                    </label>
                                ))}
                            </div>

                            {paymentMethod === 'online' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="p-6 bg-gradient-to-br from-[#00a8e8]/10 to-[#00a8e8]/5 rounded-xl border-2 border-[#00a8e8]/20 text-center space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-dashed border-[#00a8e8]/40 text-left">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black uppercase tracking-wider text-[#00a8e8]">Test Mode Card</span>
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Any Expiry / CVV</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-mono bg-slate-50 p-2 rounded border border-slate-100 group">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                                    4100 2800 0000 1007
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">MASTER SUCCESS</span>
                                                    <button onClick={(e) => { e.preventDefault(); handleCopy('4100 2800 0000 1007'); }} className="text-slate-400 hover:text-[#00a8e8] transition" title="Copy Card Number">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* <div className="flex items-center justify-between text-sm font-mono bg-slate-50 p-2 rounded border border-slate-100 group">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                                    4718 6091 0820 4366
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">RUPAY SUCCESS</span>
                                                    <button onClick={(e) => { e.preventDefault(); handleCopy('4718 6091 0820 4366'); }} className="text-slate-400 hover:text-[#00a8e8] transition" title="Copy Card Number">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {paymentMethod === 'cod' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="p-6 bg-gradient-to-br from-[#00a8e8]/10 to-[#00a8e8]/5 rounded-xl border-2 border-[#00a8e8]/20">
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
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24 space-y-6">
                            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-2xl border-2 border-slate-100">
                                <h2 className="text-2xl font-black italic uppercase text-[#00171f] mb-6 flex items-center gap-2">
                                    <Package className="w-6 h-6 text-[#00a8e8]" /> ORDER SUMMARY
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
                                                    <h4 className="font-black text-sm uppercase line-clamp-2 text-[#00171f]">{product.name || 'Product'}</h4>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs bg-[#00a8e8]/10 text-[#00a8e8] px-2 py-1 rounded-lg font-black">QTY: {item.quantity}</span>
                                                        <span className="font-black text-[#00a8e8] text-lg">₹{Math.round(finalPrice * item.quantity)}</span>
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
                                        <span className="font-black text-[#00a8e8]">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
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

                                <button onClick={handlePlaceOrder}
                                    className="w-full bg-gradient-to-r from-[#00a8e8] to-[#0095d1] text-white py-5 rounded-xl font-black italic uppercase text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                                    <Lock className="w-5 h-5" /> COMPLETE ORDER <ChevronRight className="w-5 h-5" />
                                </button>

                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {[{ icon: Lock, label: 'SSL Secured' }, { icon: Shield, label: 'Verified' }, { icon: Truck, label: 'Fast Delivery' }].map(({ icon: Icon, label }) => (
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

        </div>
    );
};

export default Checkout;