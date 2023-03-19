const jwt = require("jsonwebtoken");

const verifyApi = (req, res, next) => {
  console.log("hyyyyyyy");
  const authHeader = req.headers.authorization;
  console.log(authHeader, "headerrrr");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
      console.log(user, "jwt user");
      if (err) {
        return res.status(403).json({ message: "Your Api key is not valid" });
      }
      req.user = user.id;
      next();
    });
  } else {
    res.status(401).json({ message: "you are not authenticated!" });
  }
};

module.exports = verifyApi;
