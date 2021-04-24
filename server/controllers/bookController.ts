import { Request, Response } from "express";
import Book from "../schemas/book";

const objectName = "book";

// - GET - /books
export let allBooks = (req: Request, res: Response) => {
  let books = Book.find((err, books) => {
    res.send(err ? err : books);
  });
};

// - GET - /book/:id
export let getBook = (req: Request, res: Response) => {
  Book.findById(req.params.id, (err, book) => {
    res.send(err ? err : book);
  });
};

// - PUT - /book
export let addBook = (req: Request, res: Response) => {
  let book = new Book(req.body);
  book.save((err) => {
    res.send(err ? err : book);
  });
};

// - DELETE - /book/:id
export let deleteBook = (req: Request, res: Response) => {
  Book.deleteOne({ _id: req.params.id }, (err) => {
    res.send(err ? err : `Successfully deleted ${objectName}`);
  });
};

// - POST - /book/:id
export let updateBook = (req: Request, res: Response) => {
  Book.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
    res.send(err ? err : `Successfully updated ${objectName}`);
  });
};
