const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id,role) => {
    if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
    }
    return jwt.sign(
        {id,role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || '7d'}
    )}


exports.register = async (req,res) => {
    try{
        const {name, email, password, phone} = req.body;
        
        if (!name || !email || !password || !phone){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            phone
        })

        const token = generateToken(user._id,user.role);

        res.status(201).json({
            success: true,
            message : "User registered successfully",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                role : user.role
            }
        })}
    catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Email or phone already exists"
        });
    }

    res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message
    });
}}

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if (!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        if (!user.isActive){
            return res.status(403).json({
                success: false,
                message: "User is not active"
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }}

exports.getMe = async (req,res) => {
    try{
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting user",
            error: error.message
        });
    }}

exports.logout = async (req,res) => {
    try{
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message
        });
    }}