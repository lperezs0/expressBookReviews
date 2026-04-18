const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    if (username && password) {
        if(!doesExist(username)){
            user.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered, Now you can login"})
        }
        else{
            return res.status(400).json({message: "Username not available, try a different one!"});
        }
        
    }
    return res.status(409).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).send(books[isbn]);
 });
  
// Get book details based on author
// get all the keys from the books, every detail. from the entire array and check if the author name matches return the book details, else return that it does not exist
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let keys = Object.keys(books);
  let result = [];
  
  keys.forEach(key => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });
    res.send(result);
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  let title = req.params.title;
  let keys = Object.keys(books);
  let result = [];
  
  keys.forEach(key => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });
    res.send(result);



});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  }
  else {
    res.status(404).json({message: `No reviews found for the book`});
  }


});

module.exports.general = public_users; 
