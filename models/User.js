
const { getDB } = require("../config/db");

function usersCollection() {
    return getDB().collection("users");
}

async function createUser(user) {
    return await usersCollection().insertOne(user);
}

async function findUserByEmail(email) {
    return await usersCollection().findOne({ email });
}

async function findUserById(id) {
    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(id)) return null;

    return await usersCollection().findOne({
        _id: new ObjectId(id)
    });
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
