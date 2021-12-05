const fs = require("fs");

const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../utils/geocode");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const { id } = req.params;
  let place;

  try {
    place = await Place.findById(id);
  } catch (e) {
    const error = new HttpError(
      "Some thing went wrong Could not find places for provaided user id",
      500
    );

    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for provaided id", 404);

    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const { id } = req.params;

  let userWithplaces;

  try {
    userWithplaces = await User.findById(id).populate("places");
  } catch (e) {
    const error = new HttpError("Smoe thing went wrong", 500);
    return next(error);
  }

  if (!userWithplaces || userWithplaces.places.length === 0) {
    const error = new HttpError(
      "Could not find places for provaided user id",
      404
    );

    return next(error);
  }

  res.json({
    places: userWithplaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (e) {
    return next(e);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty) {
    const error = new HttpError(
      "Invalid inputs passed, pleas check your data.",
      422
    );
    return next(error);
  }

  const { title, description } = req.body;
  const { id } = req.params;

  let place;

  try {
    place = await Place.findById(id);
  } catch (e) {
    const error = new HttpError("Some thing went wrong ", 500);
    return next(error);
  }

  if(place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You  are not allowed to edit this palce ", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (e) {
    const error = new HttpError("Some thing went wrong cant update place", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePalce = async (req, res, next) => {
  const { id } = req.params;

  let place;
  try {
    place = await Place.findById(id).populate("creator");
  } catch (e) {
    const error = new HttpError("Some thing went Cant delete place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }
  
  if(place.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("You  are not allowed to delete this palce ", 401);
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (e) {
    const error = new HttpError("Some thing went Cant delete place", 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });


  res.status(200).json({ message: "Deleted place." });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePalce = deletePalce;
