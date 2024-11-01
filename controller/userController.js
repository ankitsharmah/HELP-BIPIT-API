import bcrypt from "bcryptjs/dist/bcrypt.js";
import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

// Register a user
export const register = async (req, res) => {
    try {
        const { fullname, nickName, email, password, gender } = req.body;

        // Check for missing fields
        if (!fullname || !nickName || !email || !password || !gender) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists",
                success: false
            });
        }

        // Hash the password
        const saltedPassword = await bcryptjs.hash(password, 10);

        // Set profile picture URL
        const pp = `https://avatar.iran.liara.run/username?username=${nickName}`;

        // Create a new user
        await User.create({
            fullname,
            email,
            nickName,
            password: saltedPassword,
            gender,
            profilePic: pp
        });

        return res.status(200).json({
            message: "Registered successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Login a user
export const login = async (req, res) => {
    console.log("Login API called");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "Email or password is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Wrong password",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            auth_token: token,
            user: user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Login error",
            success: false
        });
    }
};

// Logout a user
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Logout error",
            success: false
        });
    }
};

// Get other users excluding logged-in user
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;  // Assuming req.user is set after token verification
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching other users",
            success: false
        });
    }
};


// export const addFriend = (req,res)=>{

//     try {

//         const user = 
        
//     } catch (error) {
//         console.log(error)   
//     }
// }