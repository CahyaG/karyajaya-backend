const db = require("../models");
const User = db["user"];
const jwt = require("jsonwebtoken");

module.exports = {
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.sendStatus(401);
      }

      const user = await User.findAll({
        where: {
          refresh_token: refreshToken
        }
      });

      if (!user[0]) {
        return res.sendStatus(403);
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.sendStatus(403);
        }

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const username = user[0].username;
        const accessToken = jwt.sign({
          userId, name, email, username
        }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "60s"
        });

        res.json({
          accessToken
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
};