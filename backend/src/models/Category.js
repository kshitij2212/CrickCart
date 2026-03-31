const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true
    },
    images: [{
        type: String,
        required: true
    }],
    color: {
        type: String,
        default: "#00a8e8"
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        default: null
    }
}, {
    timestamps: true
});

categorySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true
});

categorySchema.set('toObject', {
    virtuals: true
});

categorySchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);