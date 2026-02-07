const Cart = require("../models/Cart")
const Product = require("../models/Product")

exports.getCart = async(req,res) => {
    try{

        const cart = await Cart.findOne({user : req.user.id})
        .populate({
                path: 'items.product',
                select: 'name price discount images slug countInStock'
            });


        if(!cart){
            cart = await Cart.create({user : req.user.id, items : []})
        }

        return res.status(200).json({
            success : true,
            message : "Cart fetched successfully",
            data : cart
        })

    }catch
        (error){
            return res.status(500).json({
                success : false,
                message : "Error fetching cart",
                error : error.message
            })
        }
    }

exports.addToCart = async(req,res) => {
    try{
        
        const {productId,quantity} = req.body

        if(!productId){
            return res.status(400).json({
                success : false,
                message : "Product ID is required"
            })
        }

        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({
                success : false,
                message : "Product not found"
            })    
        }        

        const requestedQuantity = quantity || 1
        if (requestedQuantity > product.countInStock){
            return res.status(400).json({
                success : false,
                message : `Only ${product.countInStock} items are available`
            }
        )}

    }catch
        (error){
            return res.status(500).json({
                success : false,
                message : "Error adding to cart",
                error : error.message
            })
        }
    }

