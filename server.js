
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { connectDB, getDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const setupChat = require("./sockets/chat");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10kb" }));

// Basic route
app.get("/", (req, res) => {
    res.json({
        message: "Secure Connect Platform API is running."
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found."
    });
});

// Initialize Socket.IO
setupChat(io);

// Start application
async function startServer() {
    try {
        if (!process.env.MONGO_URI ||
            !process.env.JWT_SECRET) {
            throw new Error(
                "MONGO_URI and JWT_SECRET must be configured."
            );
        }

        if (process.env.JWT_SECRET.length < 32) {
            throw new Error(
                "JWT_SECRET must contain at least 32 characters."
            );
        }

        await connectDB();

        // Create database indexes
        const db = getDB();

        await db.collection("users").createIndex(
            { email: 1 },
            { unique: true }
        );

        await db.collection("notes").createIndex(
            { userId: 1, createdAt: -1 }
        );

        server.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("Secure Connect Platform Started");
            console.log(`Server: http://localhost:${PORT}`);
            console.log("Authentication: Ready");
            console.log("Notes API: Ready");
            console.log("Socket.IO Chat: Ready");
            console.log("EventEmitter: Ready");
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
