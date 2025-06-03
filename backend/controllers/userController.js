import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // profilePhoto
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Your user validation logic here
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on prod, false on dev
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // needed for cross-site cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send response without token (it's in cookie)
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}
