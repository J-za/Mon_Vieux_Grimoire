const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  //Vérification de la présence
  if (!email || !password) {
    return res.status(400).json({ message: "Email and/or password required." });
  }

  //Vérification du format de l'email
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  //Vérification de la robustesse du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.",
    });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          return res
            .status(201)
            .json({ message: "User successfully created!" });
        })
        .catch((error) => {
          return res.status(400).json({
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  //Vérification de la présence
  if (!email || !password) {
    return res.status(400).json({ message: "Email and/or password required." });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password." });
      }

      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Incorrect username or password." });
          }
          return res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }),
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
};
