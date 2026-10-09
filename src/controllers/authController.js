const bcrypt = require("bcryptjs");

//

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            termsAccepted
        } = req.body;

        // Check required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check terms
        if (termsAccepted !== true) {
            return res.status(400).json({
                success: false,
                message: "Please accept Terms & Conditions and Privacy Policy"
            });
        }

        // Check email
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Check phone
        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "Phone number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            termsAccepted: true
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",

            token,

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    registerUser
};