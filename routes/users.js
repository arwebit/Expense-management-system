const express = require("express");
const app = express();
const authToken = require("../shared/token");
const userModel = require("../shared/models/user.model");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.use(authToken);

app.post(
  "/login",
  [
    [
      body("username").notEmpty().withMessage("Username cannot be empty"),
      body("password").notEmpty().withMessage("Password cannot be empty"),
    ],
  ],
  async function (req, res) {
    const userName = req.body.username.trim();
    const password = req.body.password.trim();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Recorrect errors",
        errors: errors.array(),
      });
    }
    userModel
      .find({ $and: [{ username: userName }, { password: password }] })
      .then(function (FoundItems) {
        if (FoundItems.length > 0) {
          res.status(200).send({
            statusCode: 200,
            message: "Successfully logged in",
            token: "token",
            data: FoundItems,
          });
        } else {
          res.status(205).send({
            statusCode: 205,
            message: "Login failed",
            error: "Wrong username/password",
          });
        }
      })
      .catch((e) => {
        result.send("err");
      });
  }
);

router.get("/", function (req, res) {
  userModel
    .find()
    .then(function (FoundItems) {
      if (FoundItems.length > 0) {
        res.status(200).send({
          statusCode: 200,
          message: "Data found",
          records: FoundItems.length,
          data: FoundItems,
        });
      } else {
        res.status(205).send({
          statusCode: 205,
          message: "No data found",
        });
      }
    })
    .catch((e) => {
      result.send("err");
    });
});

router.post("/", function (req, res) {
  const userName = req.body.username.trim();
  const password = req.body.password.trim();
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const email = req.body.email.trim();
  const mobile = req.body.dob.trim();
  const role = req.body.dob.trim();

  const user = new userModel({
    first_name: firstName,
    last_name: lastName,
    email: email,
    mobile: mobile,
    username: userName,
    password: password,
    role: role,
  });

  newEmployee
    .save()
    .then(() => {
      res.status(201).send({
        statusCode: 201,
        message: "Saved successfully",
      });
    })
    .catch((e) => {
      res.status(500).send({
        statusCode: 500,
        message: e,
      });
    });
});

app.use("/", router);

module.exports = app;
