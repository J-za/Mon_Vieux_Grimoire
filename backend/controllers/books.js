const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const { stack } = require("../app");

exports.createBook = (req, res, next) => {
  //JSON.stringify(book) envoyé par le frontend
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.file.imageUrl,
  });
  book
    .save()
    .then(() => {
      return res.status(201).json({ message: "Book successfully saved!" });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book) }
    : { ...req.body };
  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Forbidden." });
      }

      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.promises
          .unlink(`images/${oldFilename}`)
          .then(() => {
            bookObject.imageUrl = req.file.imageUrl;
            return Book.updateOne(
              { _id: req.params.id },
              { ...bookObject, _id: req.params.id }
            );
          })
          .then(() => {
            return res
              .status(200)
              .json({ message: "Book successfully updated!" });
          })
          .catch((error) => {
            return res.status(500).json({
              message: error.message,
              stack: error.stack,
              name: error.name,
            });
          });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            return res
              .status(200)
              .json({ message: "Book successfully updated!" });
          })
          .catch((error) => {
            return res.status(500).json({
              message: error.message,
              stack: error.stack,
              name: error.name,
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Forbidden." });
      }
      const filename = book.imageUrl.split("/images/")[1];
      fs.promises
        .unlink(path.join("images", filename))
        .then(() => {
          return Book.deleteOne({ _id: req.params.id });
        })
        .then(() => {
          return res
            .status(200)
            .json({ message: "Book successfully deleted!" });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      const alreadyRated = book.ratings.find(
        (r) => r.userId === req.auth.userId
      );
      if (alreadyRated) {
        return res
          .status(400)
          .json({ message: "You have already rated this book." });
      }
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating,
      });
      //Somme des notes
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      //Calcul de la moyenne
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then((updatedBook) => {
      return res.status(200).json(updatedBook);
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      if (!books || books.length === 0) {
        return res.status(404).json({ message: "No books found." });
      }
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.getAllBook = (req, res) => {
  Book.find()
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};
