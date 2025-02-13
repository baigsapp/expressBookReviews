const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res
      .status(409)
      .json({ message: "Username already exists. Please choose another one." });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const authorName = req.params.author;
  let result = [];

  // res.json(Object.keys(books));

  // Iterate through the books object with values
  // Object.values(books).forEach((book) => {
  //   if (book.author.toLowerCase() === authorName.toLowerCase()) {
  //     result.push(book);
  //   }
  // });

  // Iterate through the books object with keys
  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const title = req.params.title;
  let result = [];

  // Iterate through the books object with keys
  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({ message: "No books found for the given title." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
