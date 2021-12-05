/* eslint-disable no-unused-vars */
const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const userControllers = require("../controllers/users-controllers");
const router = express.Router();

router.get("/", userControllers.getUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 5 }),
    check("email").normalizeEmail().isEmail(),
  ],
  userControllers.signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.login
);

module.exports = router;
