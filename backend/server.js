// Import Required Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Initialize Express App
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS
app.use(express.static("public")); // Serve static files (HTML, CSS, JS) from public/

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/libraryDB"; // Default to local MongoDB if no URI is provided

if (!process.env.MONGO_URI && mongoURI === "mongodb://localhost:27017/libraryDB") {
  console.error("❌ Mongo URI not provided, using localhost.");
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware for Logging Requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("📚 Library Management Server is Running!");
});

// ✅ Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true }, // Unique ISBN
  isIssued: { type: Boolean, default: false }, // Track if the book is issued
});

const Book = mongoose.model("Book", bookSchema);

// ✅ Route to Add Books
app.post("/books/add", async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    const newBook = new Book({ title, author, isbn });
    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "❌ Error adding book", error });
  }
});

// ✅ Route to Get All Books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching books", error });
  }
});

// ✅ Route to Get a Single Book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "❌ Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching book", error });
  }
});

// ✅ Route to Delete a Book by ID
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "❌ Book not found" });
    res.json({ message: "✅ Book deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting book", error });
  }
});

// ✅ Route to Issue a Book
app.put("/books/issue/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "❌ Book not found" });
    if (book.isIssued) return res.status(400).json({ message: "❌ Book is already issued!" });

    book.isIssued = true;
    await book.save();
    res.json({ message: "✅ Book issued successfully!", book });
  } catch (error) {
    res.status(500).json({ message: "❌ Error issuing book", error });
  }
});

// ✅ Route to Return a Book
app.put("/books/return/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "❌ Book not found" });
    if (!book.isIssued) return res.status(400).json({ message: "❌ Book is already returned!" });

    book.isIssued = false;
    await book.save();
    res.json({ message: "✅ Book returned successfully!", book });
  } catch (error) {
    res.status(500).json({ message: "❌ Error returning book", error });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
