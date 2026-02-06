import { User } from "@Qedami/db/models/User";
import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-it";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: "This email already exists. Please sign in instead." });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: email.split("@")[0], // Default name from email
            email,
            passwordHash,
        });

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message || String(error)
        });
    }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error: any) {
        console.error("Signin error:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message || String(error)
        });
    }
};
