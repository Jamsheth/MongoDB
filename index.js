const express = require("express");

const userRouter = require("./Routes/users");
const bookRouter = require("./Routes/books");

const app = express();
const port = 3749;
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Im in / url",
  });
});

app.use("/users", userRouter);
app.use("/books", bookRouter);

app.all("*", (req, res) => {
  res.status(200).json({
    message: "Im in random URL",
  });
});

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
