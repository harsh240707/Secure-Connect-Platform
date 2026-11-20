
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

function notesCollection() {
    return getDB().collection("notes");
}

async function createNote(note) {
    return await notesCollection().insertOne(note);
}

async function getUserNotes(userId) {
    return await notesCollection()
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
}

async function findNoteById(id) {
    if (!ObjectId.isValid(id)) return null;

    return await notesCollection().findOne({
        _id: new ObjectId(id)
    });
}

async function updateNote(id, userId, updates) {
    if (!ObjectId.isValid(id)) return null;

    return await notesCollection().findOneAndUpdate(
        { _id: new ObjectId(id), userId },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" }
    );
}

async function deleteNote(id, userId) {
    if (!ObjectId.isValid(id)) return null;

    return await notesCollection().deleteOne({
        _id: new ObjectId(id),
        userId
    });
}

module.exports = {
    createNote,
    getUserNotes,
    findNoteById,
    updateNote,
    deleteNote
};
