
const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();

        db = client.db("SecureConnectDB");

        console.log("MongoDB Connected Successfully!");

        return db;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database is not connected");
    }

    return db;
}

module.exports = { connectDB, getDB };
