const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

const SECRET_KEY = "your_secret_key";

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

// Function to check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input fields
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if username exists
  if (!isValid(username)) {
    return res
      .status(404)
      .json({ message: "User not found. Please register first." });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Please try again." });
  }

  // Generate JWT Token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  req.session.user = username; // Store user information in session

  return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.user;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully.",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.user;

  // Validate if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Validate if the user has posted a review
  if (!books[isbn].reviews[username]) {
    return res
      .status(400)
      .json({ message: "No review found for this book under your username." });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Your review has been deleted successfully.",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
