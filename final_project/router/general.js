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

const getAllBooks = () => {
  return JSON.stringify(books, null, 4);
};

// Get the book list available in the shop
public_users.get("/", async function async(req, res) {
  //Write your code here
  const result = await getAllBooks();
  res.send(result);
});

const getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]); // Resolve with book details if found
      } else {
        reject("Book not found"); // Reject if ISBN doesn't exist
      }
    }, 3000); // Simulate async delay (3 seconds)
  });
};

// Get book details based on ISBN using a Promise
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  getBookByIsbn(isbn)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

const getBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
          result.push(books[key]);
        }
      });
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("No books found for the given author.");
      }
    }, 3000); // Simulating async delay (3s)
  });
};

public_users.get("/author/:author", async function (req, res) {
  const authorName = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthor(authorName);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = async (title) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = [];

        Object.keys(books).forEach((key) => {
          if (books[key].title.toLowerCase() === title) {
            result.push(books[key]);
          }
        });

        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No books found for the given title.");
        }
      }, 3000); // Simulating async delay (3s)
    });
  };

  try {
    const booksByTitle = await getBooksByTitle(title);
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: error });
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
