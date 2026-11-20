
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/User");

const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleCheck");
const { getDB } = require("../config/db");
const appEvents = require("../utils/eventEmitter");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        if (typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Invalid input types."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            createdAt: new Date()
        };

        await createUser(user);

        appEvents.emit("userRegistered", {
            name: user.name,
            email: user.email
        });

        res.status(201).json({
            message: "User registered successfully."
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        console.error("Signup error:", error.message);

        res.status(500).json({
            message: "Internal server error."
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Valid email and password are required."
            });
        }

        const user = await findUserByEmail(
            email.trim().toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        appEvents.emit("userLogin", {
            name: user.name,
            email: user.email
        });

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Internal server error."
        });
    }
});

// PROTECTED PROFILE
router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Protected profile accessed successfully.",
        user: req.user
    });
});

// ADMIN ONLY ROUTE
router.get(
    "/admin/users",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const users = await getDB()
                .collection("users")
                .find({})
                .project({
                    password: 0
                })
                .toArray();

            res.json({
                message: "Admin access granted.",
                users
            });

        } catch (error) {
            res.status(500).json({
                message: "Unable to fetch users."
            });
        }
    }
);

module.exports = router;
