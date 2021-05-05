import express from "express";
import cors from "cors"
import * as bookController from "./controllers/bookController";
import * as twitterUserController from "./controllers/twitterUserController";
import * as youtubeRequestController from "./controllers/ytRequestController";

import authRoute from "./routes/authRoute"
import gw2Route from "./routes/gw2Route"

import * as dotenv from "dotenv";
dotenv.config()

const app = express();

app.use(cors()) // Allow all requests
app.use(express.json());

// Connect to local MongoDB instance
import { connectMongoose } from "./schemas/_util";
connectMongoose()

// Route Middlewares
app.use("/v1/user", authRoute)
app.use("/v1/gw2", gw2Route)


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

app.listen(process.env.SERVER_PORT, () => {
  console.log("App is running on localhost", process.env.SERVER_PORT);
});
