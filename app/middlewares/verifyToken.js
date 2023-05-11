const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader;

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.sendStatus(403);
      }

      req.username = decoded.username;
      next();
    });
  }
};