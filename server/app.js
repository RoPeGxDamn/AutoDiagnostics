require("dotenv").config();
const chalk = require("chalk");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/index");
const app = express();

const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", err);
  next(err);
};

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", "application/json");
  res.status(406).json({
    message: err,
  });
};

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

const PORT = process.env.PORT || 9000;

// const myLogger = function (req, res, next) {
//   console.log('LOGGED')
//   next()
// }
// app.use(myLogger)

app.use("/", router);
app.use(errorLogger);
app.use(errorResponder);

app.get("/", (req, res, next) => {
  res.send("Hello, Roman!");
});

app.listen(PORT, () => {
  console.log(chalk.cyan(`Server is running on PORT ${PORT}...`));
  // console.log(`Server is running on PORT ${PORT}...`);
});
