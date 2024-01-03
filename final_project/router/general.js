const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if( !username || !password ) return res.status(400).json({message: "Username and password are required"});

  if( isValid(username) ) return res.status(400).json({message: "User already exists"});

  users.push({username: username, password: password});

  return res.status(200).json({message: "User registered successfully"});
  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const bookList = await getBooks();
    return res.status(200).json({books: bookList});
  } catch (error) {
    return res.status(400).json({message: error.message});  
  }
  
});

// Get all books helper function
function getBooks(){
  return new Promise((resolve, reject) => {
    if( books ){
      resolve(books);
    }
  }); 
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if( !isbn ) return res.status(400).json({message: "ISBN is required"});  

  getBookByISBN(isbn)
  .then((book) => {
    return res.status(200).json({book: book});
  })
  .catch((error) => {
    return res.status(400).json({message: error.message});  
  });

});

// Get book by isbn helper function
function getBookByISBN(isbn){
  return new Promise((resolve, reject) => {
    const booksArray = Object.entries(books);
    const isbnFilter = booksArray.filter(([key, value]) => key === isbn);

    if( isbnFilter.length > 0 ) {
      const book = Object.fromEntries(isbnFilter);
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const { author } = req.params;
  if( !author ) return res.status(400).json({message: "Author is required"});

  getBookByAuthor(author)
    .then((book) => {
      return res.status(200).json({book: book});
    })
    .catch((error) => {
      return res.status(400).json({message: error.message});  
    });
});

// Get book by author helper function
function getBookByAuthor(author){
  return new Promise((resolve, reject) => {
    const booksArray = Object.entries(books);
    const authorFilter = booksArray.filter(([key, value]) => value.author.toLowerCase() === author.toLowerCase());

    if( authorFilter.length > 0 ) {
      const book = Object.fromEntries(authorFilter);
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });  

}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const { title } = req.params;
  if( !title ) return res.status(400).json({message: "Title is required"});

  getBookByTitle(title)
    .then((book) => {
      return res.status(200).json({book: book});
    })
    .catch((error) => {
      return res.status(400).json({message: error.message});  
    });
});

// Get book by title helper function
function getBookByTitle(title){
  return new Promise((resolve, reject) => {
    const bookArray = Object.entries(books);
    const titleFilter = bookArray.filter(([key, value]) => value.title.toLowerCase() === title.toLowerCase());

    if( titleFilter.length > 0 ) {
      const book = Object.fromEntries(titleFilter);
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });  

}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if( !isbn ) return res.status(400).json({message: "ISBN is required"});
  
  getBookByISBN(isbn)
    .then((book) => {
      const bookArray = Object.values(book);
      const bookReview = bookArray[0].reviews;
      return res.status(200).json({ISBN: isbn, review: bookReview});
    })
    .catch((error) => {
      return res.status(400).json({message: error.message});  
    });
});

module.exports.general = public_users;
