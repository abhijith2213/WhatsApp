require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const cors = require("cors");
const path = require("path");
const port = process.env.PORT;
const { connectDb } = require("./Config/MongoConnection");

const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chat");
const messageRoute = require("./Routes/messages");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

connectDb();

server.listen(port, () => {
  console.log("listening on *:port");
});

module.exports = server;
