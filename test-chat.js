
const { io } = require("socket.io-client");

const token = process.env.CHAT_TOKEN;

if (!token) {
    console.error("JWT token not provided.");
    process.exit(1);
}

const clientA = io("http://localhost:5000", {
    auth: { token }
});

const clientB = io("http://localhost:5000", {
    auth: { token }
});

let connected = 0;
let sent = false;

function ready() {
    connected++;

    if (connected === 2 && !sent) {
        sent = true;
        console.log("Both clients connected successfully.");

        clientA.emit("chatMessage", {
            message: "Hello from Secure Connect Chat!"
        });
    }
}

clientA.on("chatConnected", ready);
clientB.on("chatConnected", ready);

clientB.on("newMessage", (data) => {
    console.log("Received message:", data);

    if (data.message === "Hello from Secure Connect Chat!") {
        console.log("SUCCESS: Real-time chat is working!");
        clientA.disconnect();
        clientB.disconnect();
        process.exit(0);
    }
});

clientA.on("connect_error", (error) => {
    console.error("Client A error:", error.message);
    process.exit(1);
});

clientB.on("connect_error", (error) => {
    console.error("Client B error:", error.message);
    process.exit(1);
});

setTimeout(() => {
    console.error("Chat test timed out.");
    clientA.disconnect();
    clientB.disconnect();
    process.exit(1);
}, 15000);
