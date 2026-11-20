
const EventEmitter = require("events");

const appEvents = new EventEmitter();

appEvents.on("userRegistered", (user) => {
    console.log("EVENT: New user registered:", user.email);
});

appEvents.on("noteCreated", (note) => {
    console.log("EVENT: New note created:", note.title);
});

appEvents.on("userLogin", (user) => {
    console.log("EVENT: User logged in:", user.email);
});

appEvents.on("chatMessage", (message) => {
    console.log("EVENT: New chat message:", message);
});

module.exports = appEvents;
