import { Router, type Request, type Response } from "express";
import { User } from "@Qedami/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createSuccessResponse, createErrorResponse } from "../utils/helpers.js";

const router: Router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Middleware to verify JWT token
export const authenticateToken = async (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(createErrorResponse("NO_TOKEN", "Access token required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user || !user.isActive) {
      return res.status(401).json(createErrorResponse("INVALID_TOKEN", "Invalid or expired token"));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(createErrorResponse("INVALID_TOKEN", "Invalid or expired token"));
  }
};

// Sign Up
router.post("/api/v1/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json(createErrorResponse("MISSING_FIELDS", "Name, email, and password are required"));
    }

    if (password.length < 6) {
      return res.status(400).json(createErrorResponse("WEAK_PASSWORD", "Password must be at least 6 characters"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json(createErrorResponse("USER_EXISTS", "User already exists with this email"));
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      profile: {
        preferredLanguage: "en"
      },
      searchHistory: [],
      isActive: true
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    res.status(201).json(
      createSuccessResponse({
        user: user.toJSON(),
        token
      })
    );
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json(createErrorResponse("SIGNUP_ERROR", "Failed to create account"));
  }
});

// Sign In
router.post("/api/v1/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json(createErrorResponse("MISSING_FIELDS", "Email and password are required"));
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json(createErrorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json(createErrorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    res.json(
      createSuccessResponse({
        user: user.toJSON(),
        token
      })
    );
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json(createErrorResponse("SIGNIN_ERROR", "Failed to sign in"));
  }
});

// Get current user (verify token)
router.get("/api/v1/auth/me", authenticateToken, async (req: any, res) => {
  try {
    res.json(
      createSuccessResponse({
        user: req.user
      })
    );
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json(createErrorResponse("USER_ERROR", "Failed to get user data"));
  }
});

// Sign Out (optional - mainly for tracking)
router.post("/api/v1/auth/signout", authenticateToken, async (req: any, res) => {
  try {
    // In a more sophisticated setup, you might invalidate the token
    // For now, we'll just return success since the client will remove the token
    res.json(createSuccessResponse({ message: "Signed out successfully" }));
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json(createErrorResponse("SIGNOUT_ERROR", "Failed to sign out"));
  }
});

// Update user profile
router.put("/api/v1/auth/profile", authenticateToken, async (req: any, res) => {
  try {
    const { name, preferredLanguage, savedLocation } = req.body;
    const user = req.user;

    if (name) user.name = name.trim();
    if (preferredLanguage && ['en', 'am'].includes(preferredLanguage)) {
      user.profile.preferredLanguage = preferredLanguage;
    }
    if (savedLocation && savedLocation.coordinates && Array.isArray(savedLocation.coordinates)) {
      user.profile.savedLocation = {
        type: "Point",
        coordinates: savedLocation.coordinates
      };
    }

    await user.save();

    res.json(
      createSuccessResponse({
        user: user.toJSON()
      })
    );
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json(createErrorResponse("UPDATE_ERROR", "Failed to update profile"));
  }
});

// Add search to history
router.post("/api/v1/auth/search-history", authenticateToken, async (req: any, res) => {
  try {
    const { query } = req.body;
    const user = req.user;

    if (!query || typeof query !== 'string') {
      return res.status(400).json(createErrorResponse("INVALID_QUERY", "Valid search query required"));
    }

    // Add to search history (limit to last 50 searches)
    user.searchHistory.unshift({
      query: query.trim(),
      timestamp: new Date()
    });

    // Keep only last 50 searches
    if (user.searchHistory.length > 50) {
      user.searchHistory = user.searchHistory.slice(0, 50);
    }

    await user.save();

    res.json(createSuccessResponse({ message: "Search added to history" }));
  } catch (error) {
    console.error("Add search history error:", error);
    res.status(500).json(createErrorResponse("HISTORY_ERROR", "Failed to add search to history"));
  }
});

export default router;