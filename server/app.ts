import express from "express";
import * as bookController from "./controllers/bookController";
import * as twitterUserController from "./controllers/twitterUserController";
const app = express();
app.set("port", 3000);

app.use(express.json());

app.get("/books", bookController.allBooks);
app.get("/books/:id", bookController.getBook);
app.put("/book", bookController.addBook);
app.delete("/book/:id", bookController.deleteBook);
app.post("/book/:id", bookController.updateBook);

app.get("/twitter/users", twitterUserController.allUsers);
app.get("/twitter/user/:id", twitterUserController.getUser);
app.put("/twitter/user", twitterUserController.addUser);
app.delete("/twitter/user/:id", twitterUserController.deleteUser);
app.post("/twitter/user/:id", twitterUserController.updateUser);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(app.get("port"), () => {
  console.log("App is running on localhost", app.get("port"));
});
