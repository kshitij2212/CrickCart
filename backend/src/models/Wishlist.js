const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });


wishlistSchema.virtual("id").get(function(){
    return this._id.toHexString();
})

wishlistSchema.virtual("totalItems").get(function(){
    return this.items.length;
})

wishlistSchema.set("toJSON",{
    virtuals : true,
    versionKey : false,
    transform : function(doc,ret){
        ret.id = ret._id;
        delete ret._id;
    }
})

module.exports = mongoose.model("Wishlist",wishlistSchema);