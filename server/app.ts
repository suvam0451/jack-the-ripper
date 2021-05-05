import express from "express";
import * as bookController from "./controllers/bookController";
import * as twitterUserController from "./controllers/twitterUserController";
import * as youtubeRequestController from "./controllers/ytRequestController";

import authRoute from "./routes/auth"

const app = express();
app.set("port", 3000);

app.use(express.json());

import { connectMongoose } from "./schemas/_util";

connectMongoose()

// Route Middlewares
app.use("/api/user", authRoute)

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

app.get("/youtube/requests", youtubeRequestController.allRequests);
app.get("/youtube/requests/:id", youtubeRequestController.getRequest);
app.put("/youtube/requests/:id", youtubeRequestController.addRequest);
app.delete("/youtube/requests/:id", youtubeRequestController.deleteRequest);
app.post("/youtube/requests/:id", youtubeRequestController.updateRequest);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(app.get("port"), () => {
  console.log("App is running on localhost", app.get("port"));
});
