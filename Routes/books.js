const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

// "/book" Api with get method to get all details of the book
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

// "/book/:id" Api with get method TO GET Certain book details
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book) {
    res.status(404).json({
      success: false,
      message: "Invalid Book id",
    });
  }
  return res.status(200).json({
    success: true,
    data: book,
  });
});

//"/issued/books" Api with get method to get issued book details

router.get("/issued/books", (req, res) => {
  const userwithissuedBooks = users.filter((each) => {
    //why we use users because issuedBook column is placed in users.json
    if (each.issuedBook) return each; //why we use users because issuedBook column is placed in users.json
  });
  const issuedBooks = []; // create a new array because to cross check the bookissued id in users.json are same in books.json

  userwithissuedBooks.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook); // if the case the all id are stored in book variable

    book.issuedBy = each.name; //this for to append (add) from users.json along with book isued details in output
    book.issuedDate = each.issuedDate;
    book.returnDate = each.returnDate;
    issuedBooks.push(book); // then push the entire book information to the issuedbooks which means array
  });

  if (issuedBooks.length === 0) {
    //if isuedBooks not found
    return res.status(400).json({
      success: false,
      message: "No issued book yet",
    });
  }

  return res.status(200).json({
    // if issuedBook found
    success: true,
    data: issuedBooks,
  });
});

//to add a new book
router.post("/", (req, res) => {
  const { data } = req.body;

  if (!data) {
    res.status(404).json({
      success: false,
      messaga: "no data provided",
    });
  }
  const book = books.find((each) => each.id === data.id);
  if (book) {
    res.status(404).json({
      success: false,
      messaga: "This id is already exist",
    });
  }
  const allbooks = [...books, data];
  return res.status(200).json({
    success: true,
    data: allbooks,
  });
});

// "/book/id" API with put method
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = books.find((each) => each.id === id);
  if (!book) {
    res.status(404).json({
      succcess: false,
      message: "Book not found",
    });
  }
  const updatedBook = books.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    data: updatedBook,
  });
});

module.exports = router;
