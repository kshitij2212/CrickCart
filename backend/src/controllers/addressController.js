const User = require('../models/User');

exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            count: user.addresses.length,
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching addresses', error: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

        if (!name || !phone || !street || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
        }

        if (!/^[1-9][0-9]{5}$/.test(pincode)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit pincode' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.addresses.length >= 5) {
            return res.status(400).json({ success: false, message: 'Maximum 5 addresses allowed. Please delete an existing one.' });
        }

        const newAddress = { name, phone, street, city, state, pincode, country: country || 'India', isDefault: false };

        if (isDefault || user.addresses.length === 0) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding address', error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const { name, phone, street, city, state, pincode, country, isDefault } = req.body;

        if (phone && !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
        }

        if (pincode && !/^[1-9][0-9]{5}$/.test(pincode)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit pincode' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        if (name)    address.name    = name;
        if (phone)   address.phone   = phone;
        if (street)  address.street  = street;
        if (city)    address.city    = city;
        if (state)   address.state   = state;
        if (pincode) address.pincode = pincode;
        if (country) address.country = country;

        if (isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
            address.isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating address', error: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const wasDefault = address.isDefault;

        address.deleteOne();

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting address', error: error.message });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        user.addresses.forEach(addr => { addr.isDefault = false; });
        address.isDefault = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Default address updated',
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error setting default address', error: error.message });
    }
};