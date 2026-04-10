const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
        try {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const { amount } = req.body;
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
            };

            const order = await razorpay.orders.create(options);

            if (!order) {
                return res.status(500).json({ success: false, message: "Order creation failed" });
            }

            res.status(200).json({ success: true, order });
        } catch (error) {
            console.error("Razorpay Create Order Error:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };

exports.verifyPayment = async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                return res.status(200).json({ success: true, message: "Payment verified successfully" });
            } else {
                return res.status(400).json({ success: false, message: "Invalid signature sent!" });
            }
        } catch (error) {
            console.error("Razorpay Verify Payment Error:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
