const jwt = require("jsonwebtoken");
const secret = "jdf;kljhuihn0qhuewhfn-que";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userToken = jwt.verify(token, secret);

    req.userId = userToken.userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const createToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    secret
    // ,{
    //   expiresIn: "10m",
    // }
  );
  return token;
};

module.exports = {authMiddleware,createToken};
