const express = require("express");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const server = express();

server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

// server.get("/", (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`);
// });

server.get("/", (req, res) =>
  res.status(200).json({ message: "It's working" })
);

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] 
    ${req.method} to ${req.url} from ${req.hostname}`
  );
  next();
}

module.exports = server;
