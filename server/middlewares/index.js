const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    console.log(process.env.TOKEN_KEY);
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      console.log(user);

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const verifyEmployee = async (req, res, next) => {
  if (req.user.role == "employee") {
    next();
  } else {
    return res.status(403).json({
      message: "You don't have laws!",
    });
  }
};

const verifyAdmin = async (req, res, next, role) => {
  if (req.role == role) {
    next();
  }
  return res.status(403).json({
    message: "You don't have laws!",
  });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("Executing error handling middleware");
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { authenticateJWT, errorHandlerMiddleware, verifyEmployee };
