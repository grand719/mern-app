const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const HttpError = require("../models/http-error");
const user = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    const error = new HttpError("Fetching users failed", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {

    return next(
      new HttpError("Invalid inputs passed, pleas check your data.", 422)
    );
  }

  const { name, password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError(
      "Singing up failed, plas try agani later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exist allready", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password,12);
  }catch(e) {
    const err = new HttpError("Could not create user pleas try again", 500);

    return next(err);
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (e) {
    const error = new HttpError(
      "Singing up failed, plas try agani later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({userId: newUser.id, email: newUser.email}, "supersecret_dont_share", {expiresIn: "1h"});
  }catch(e) {
    const err = new HttpError("Singing up failed, plas try agani later.", 500);

    return next(err);
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token: token });
};

const login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, pleas check your data.", 422)
    );
  }

  const { password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Login failed, plas try agani later.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credantials could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  }catch(e) {
    const err = new HttpError("Could not log you in", 500);
    return next(err)
  }

  if(!isValidPassword) {
    const error = new HttpError(
      "Invalid credantials could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({userId: existingUser.id, email: existingUser.email}, "supersecret_dont_share", {expiresIn: "1h"});
  }catch(e) {
    const err = new HttpError("Logging in failed, plas try agani later.", 500);

    return next(err);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
