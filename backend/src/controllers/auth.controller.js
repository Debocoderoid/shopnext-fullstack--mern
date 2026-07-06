const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

function generateToken(id) {
    return jwt.sign(
        {id}, 
        process.env.JWT_SECRET,
        {expiresIn: '30d' },
    )
}

/**
 * @name registerUser
 * @description Registers a new user, hashes the password, sends a registration OTP via email, and returns a JWT token.
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUser(req, res) {
    const {name, email, password} = req.body;

    try {
        const userExists = await userModel.findOne({ email })

        if(userExists) {
            return res.status(400).json({
                message: "User Already Exists"
            })
        }

        //hash the password before saving to database
        // Implement jwt token genetayon for authentication and authorization
        // OTP sending and verification for email verification
        // welcome email sending after successful registration

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
        })
        
        if(newUser) {
            const message = `
            Welcome to ShopNext, ${name}

            Your OTP for ShopNext registration is: ${otp}

            This OTP will expire in 10 minutes.
            `;

            await sendEmail(email, `Welcome to ShopNest - Your OTP for registration`, message)

            res.status(201).json({
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                message: "Registration successful. Please verify your email."
            })
        }
        else {
            return res.status(400).json({
                message: "Invalid user data"
            })
        }
    }
    catch(err) {
        res.status(500).json({
            message: "Server error"
        })
    }
}


/**
 * @name loginUser
 * @description Authenticates a user using email and password and returns a JWT token on successful login.
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUser(req, res) {
    const {email, password} = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (!user.verified) {
            return res.status(401).json({
                message: "Please verify your email first."
            });
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if(user && correctPassword) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
        }
        else {
            res.status(400).json({
                message: "Invalid email or password"
            })
        }
    }
    catch(err) {
        res.status(500).json({
            message: "server error"
        })
    }
}


/**
 * @name getUsers
 * @description Retrieves all registered users excluding their passwords.
 * @route GET /api/auth/users
 * @access Private/Admin
 */
async function getUsers(req, res) {
    try {
        const users = await userModel.find({}).select('-password')
        res.json(users)
    }
    catch(error) {
        res.status(500).json({
            message: "server error"
        })
    }
}


async function verifyEmail(req, res) {
    const {email, otp} = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "Email already verified"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({
            message: "Email verified successfully",
            token: generateToken(user._id)
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail
};