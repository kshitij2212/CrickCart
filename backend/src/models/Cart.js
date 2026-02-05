const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        unique : true,
        required : true
    },
    items : [{
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        },
        quantity : {
            type : Number,
            required : true,
            min : [1,"Quantity cannot be less than 1"],
            default : 1
        },
        price : {
            type : Number,
            required : true
        },
        addedTime : {
            type : Date,
            default : Date.now
        }
    }],
},{timestamps : true})

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Total items in cart
cartSchema.virtual('totalItems').get(function () {
    return this.items.reduce(
        (total, item) => total + item.quantity,
        0
    );
});

// Total price of cart
cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
});
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model("Cart", cartSchema);