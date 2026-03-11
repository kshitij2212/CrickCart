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

module.exports = mongoose.model('Category', categorySchema);