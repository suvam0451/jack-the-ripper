import { Request, Response } from "express";
import TwitterUser from "../schemas/twitterUser";

const objectName = "twitter user";

// - GET - /books
export let allUsers = (req: Request, res: Response) => {
  let users = TwitterUser.find((err, newDocument) => {
    res.send(err ? err : newDocument);
  });
};

// - GET - /book/:id
export let getUser = (req: Request, res: Response) => {
  TwitterUser.findById(req.params.id, (err, newDocument) => {
    res.send(err ? err : newDocument);
  });
};

// - PUT - /book
export let addUser = (req: Request, res: Response) => {
  let newDocument = new TwitterUser(req.body);
  newDocument.save((err) => {
    res.send(err ? err : newDocument);
  });
};

// - DELETE - /book/:id
export let deleteUser = (req: Request, res: Response) => {
  TwitterUser.deleteOne({ _id: req.params.id }, (err) => {
    res.send(err ? err : `Successfully deleted ${objectName}`);
  });
};

// - POST - /book/:id
export let updateUser = (req: Request, res: Response) => {
  TwitterUser.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
    res.send(err ? err : `Successfully updated ${objectName}`);
  });
};
