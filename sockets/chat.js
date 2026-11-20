
const jwt = require("jsonwebtoken");
const appEvents = require("../utils/eventEmitter");

function setupChat(io) {

    // Authenticate every socket connection
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication required."));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;
            next();

        } catch (error) {
            next(new Error("Invalid or expired token."));
        }
    });

    io.on("connection", (socket) => {

        console.log(
            `CHAT: ${socket.user.email} connected.`
        );

        socket.emit("chatConnected", {
            message: "Connected to Secure Connect Chat."
        });

        // Receive chat message
        socket.on("chatMessage", (data) => {

            if (
                !data ||
                typeof data.message !== "string" ||
                !data.message.trim() ||
                data.message.length > 1000
            ) {
                return socket.emit("chatError", {
                    message: "Invalid message."
                });
            }

            const chatData = {
                sender: socket.user.email,
                message: data.message.trim(),
                timestamp: new Date()
            };

            // Broadcast to connected authenticated users
            io.emit("newMessage", chatData);

            appEvents.emit("chatMessage", {
                sender: chatData.sender
            });
        });

        socket.on("disconnect", () => {
            console.log(
                `CHAT: ${socket.user.email} disconnected.`
            );
        });
    });
}

module.exports = setupChat;
