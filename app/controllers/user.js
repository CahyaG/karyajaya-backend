const db = require("../models");
const User = db['user'];
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async register(req, res) {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send({
        message: "Password and confirm password do not match."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    try {
      await User.create({
        name: name,
        username: username,
        email: email,
        password: hashedPassword
      });

      res.json({
        message: "Register success."
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while registering your data."
      });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findAll({
        where: {
          username: req.body.username
        }
      });

      const match = await bcrypt.compare(req.body.password, user[0].password);

      if (!match) {
        return res.status(400).send({
          message: "Wrong password."
        });
      }

      const userId = user[0].id;
      const name = user[0].name;
      const username = user[0].username;
      const email = user[0].email;
      const accessToken = jwt.sign({
        userId, username, name, email
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      const refreshToken = jwt.sign({
        userId, username, name, email
      }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
      });

      await User.update({
        refresh_token: refreshToken
      }, {
        where: {
          id: userId
        }
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({ accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message || "Some error occurred while attempting to login."
      });
    }
  },

  async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    const user = await User.findAll({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!user[0]) {
      return res.sendStatus(204);
    }

    const userId = user[0].id;
    await User.update({ refresh_token: null }, {
      where: {
        id: userId
      }
    });

    res.clearCookie("refreshToken");
    res.sendStatus(200);
  }
};