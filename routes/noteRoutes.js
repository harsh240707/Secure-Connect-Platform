
const express = require("express");

const authenticateToken = require("../middleware/auth");

const {
    createNote,
    getUserNotes,
    updateNote,
    deleteNote
} = require("../models/Note");

const appEvents = require("../utils/eventEmitter");

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

// CREATE NOTE
router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (typeof title !== "string" ||
            typeof content !== "string" ||
            !title.trim() ||
            !content.trim()) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        if (title.length > 150 || content.length > 10000) {
            return res.status(400).json({
                message: "Note exceeds the allowed length."
            });
        }

        const note = {
            userId: req.user.id,
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await createNote(note);

        appEvents.emit("noteCreated", note);

        res.status(201).json({
            message: "Note created successfully.",
            note: {
                _id: result.insertedId,
                ...note
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to create note."
        });
    }
});

// GET ALL PERSONAL NOTES
router.get("/", async (req, res) => {
    try {
        const notes = await getUserNotes(req.user.id);

        res.json({
            message: "Notes fetched successfully.",
            count: notes.length,
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch notes."
        });
    }
});

// UPDATE NOTE
router.put("/:id", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (
            (title !== undefined &&
                (typeof title !== "string" ||
                 !title.trim() ||
                 title.length > 150)) ||
            (content !== undefined &&
                (typeof content !== "string" ||
                 !content.trim() ||
                 content.length > 10000)) ||
            (title === undefined && content === undefined)
        ) {
            return res.status(400).json({
                message: "Provide a valid title or content."
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title.trim();
        if (content !== undefined) updates.content = content.trim();

        const note = await updateNote(
            req.params.id,
            req.user.id,
            updates
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        res.json({
            message: "Note updated successfully.",
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to update note."
        });
    }
});

// DELETE NOTE
router.delete("/:id", async (req, res) => {
    try {
        const result = await deleteNote(
            req.params.id,
            req.user.id
        );

        if (!result || result.deletedCount === 0) {
            return res.status(404).json({
                message: "Note not found."
            });
        }

        res.json({
            message: "Note deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete note."
        });
    }
});

module.exports = router;
