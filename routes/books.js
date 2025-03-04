// routes/books.js
const express = require("express");
const Book = require("../backend/Book");

const router = express.Router();

// Add a new book
router.post("/add", async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    const newBook = new Book({ title, author, isbn });
    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "❌ Error adding book", error });
  }
});

// View all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching books", error });
  }
});

// Issue a book (update isIssued status)
router.put("/issue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (book.isIssued) {
      return res.status(400).json({ message: "❌ Book already issued" });
    }
    book.isIssued = true;
    await book.save();
    res.json({ message: "✅ Book issued successfully!", book });
  } catch (error) {
    res.status(500).json({ message: "❌ Error issuing book", error });
  }
});

// Return a book (update isIssued status to false)
router.put("/return/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book.isIssued) {
      return res.status(400).json({ message: "❌ Book not issued" });
    }
    book.isIssued = false;
    await book.save();
    res.json({ message: "✅ Book returned successfully!", book });
  } catch (error) {
    res.status(500).json({ message: "❌ Error returning book", error });
  }
});

module.exports = router;
