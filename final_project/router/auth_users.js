const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const userFilter = users.find(user => user.username.toLowerCase() === username.toLowerCase());

  if( userFilter ) {
    return true;
  } else {
    return false;
  }  
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const userFilter = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

  if( userFilter ) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if( !username || !password ) return res.status(400).json({message: "Username and password are required"});

  if( !isValid(username) ) return res.status(400).json({message: "User does not exist"});

  if( !authenticatedUser(username,password) ) return res.status(400).json({message: "Invalid credentials"});

  const token = jwt.sign({user: username}, "fingerprint_customer");

  req.session.authorization = { token }

  return res.status(200).json({message: "User successfully logged in."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  if( !isbn ) return res.status(400).json({message: "ISBN is required"});
  const {user, review } = req.body;
  if( !user ) return res.status(400).json({message: "User is not logged in."});
  if( !review ) return res.status(400).json({message: "Review is required"});

  updateReview(isbn, user.user, review)
    .then((book) => {
      return res.status(200).json({message: "Review added successfully", book: book});
    })
    .catch((error) => {
      return res.status(400).json({message: error.message});  
    });

});

// Update a book review helper function
function updateReview(isbn, user, review){
  return new Promise((resolve, reject) => {
    books[isbn].reviews[user] = {review};
    resolve(books[isbn]);
  });
 
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
