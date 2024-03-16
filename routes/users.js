const express = require("express");
const app = express();
const authToken = require("../shared/middlewares/token");
const customErrorFormatter = require("../shared/middlewares/format_error");
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
    const userName = req.body.username;
    const password = req.body.password;
    const errors = validationResult(req).formatWith(customErrorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Recorrect errors",
        errors: errors.mapped(),
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

router.post(
  "/",
  [
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
    body("first_name").notEmpty().withMessage("First name cannot be empty"),
    body("last_name").notEmpty().withMessage("Last name cannot be empty"),
    body("email")
      .if(body("email").notEmpty())
      .isEmail()
      .withMessage("Invalid email"),
    body("mobile")
      .if(body("mobile").notEmpty())
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile no must be 10 digits"),
    body("role").notEmpty().withMessage("Role cannot be empty"),
  ],
  async function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const role = req.body.role;
    const errors = validationResult(req).formatWith(customErrorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Recorrect errors",
        errors: errors.mapped(),
      });
    }
    const user = new userModel({
      first_name: firstName,
      last_name: lastName,
      email: email,
      mobile: mobile,
      username: userName,
      password: password,
      role: role,
    });

    user
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
  }
);

router.put(
  "/:user_id",
  [
    body("first_name").notEmpty().withMessage("First name cannot be empty"),
    body("last_name").notEmpty().withMessage("Last name cannot be empty"),
    body("email")
      .if(body("email").notEmpty())
      .isEmail()
      .withMessage("Invalid email"),
    body("mobile")
      .if(body("mobile").notEmpty())
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile no must be 10 digits"),
  ],
  async function (req, res) {
    const userID = req.params.user_id;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const errors = validationResult(req).formatWith(customErrorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Recorrect errors",
        errors: errors.mapped(),
      });
    }

    let newUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      mobile: mobile,
    };

    userModel
      .findByIdAndUpdate(userID, newUser)
      .then(() => {
        res.status(201).send({
          statusCode: 201,
          message: "Updated successfully",
        });
      })
      .catch((e) => {
        res.status(500).send({
          statusCode: 500,
          message: e,
        });
      });
  }
);

router.post(
  "/passchange",
  [
    body("username").notEmpty().withMessage("Username cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  async function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    const errors = validationResult(req).formatWith(customErrorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Recorrect errors",
        errors: errors.mapped(),
      });
    }

    let newUser = {
      password: password,
    };

    userModel
      .updateOne({ username: userName }, newUser)
      .then(() => {
        res.status(201).send({
          statusCode: 201,
          message: "Password changed successfully",
        });
      })
      .catch((e) => {
        res.status(500).send({
          statusCode: 500,
          message: e,
        });
      });
  }
);

app.use("/", router);

module.exports = app;
