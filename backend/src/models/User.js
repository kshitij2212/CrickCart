const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
     password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone:{
        type :String,
        required: [true, 'Please enter your phone number'],
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
    },
    addresses: [{
        name: {
            type: String,
            required: true},
        phone: {
            type: String,
            required: true},
        street: {
            type: String,
            required: true},
        city: {
            type: String,
            required: true},
        state: {
            type: String,
            required: true},
        pincode: {
            type: String,
            required: true},
        country: {
            type: String,
            default: 'India' },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});


userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

