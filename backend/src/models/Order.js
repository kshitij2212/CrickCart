const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: Number
    }],
    shippingAddress: {
        name: String,
        phone: {
            type: String,
            match: [/^[6-9]\d{9}$/, 'Invalid phone number']
        },
        street: String,
        city: String,
        state: String,
        pincode: {
            type: String,
            match: [/^[1-9][0-9]{5}$/, 'Invalid pincode']
        },
        country: {
            type: String,
            default: 'India'
        }
    },
    payment: {
        method: {
            type: String,
            required: true,
            enum: ['COD', 'Card', 'UPI', 'Wallet']
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Pending'
        },
        transactionId: String,
        provider: String,
        paidAt: Date,
        refundedAt: Date
    },
    pricing: {
        itemsPrice: Number,
        shippingPrice: {
            type: Number,
            default: 100
        },
        taxPrice: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        totalPrice: Number
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'],
        default: 'Pending',
        index: true
    },
    deliveredAt: Date,
    cancelledAt: Date,
    returnRequestedAt: Date,
    returnedAt: Date
}, {
    timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });

// Safe orderNumber generation
orderSchema.statics.generateOrderNumber = async function() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}-${timestamp}${random}`;
};

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Order', orderSchema);