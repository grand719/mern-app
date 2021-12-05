const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
const placesControllers = require("../controllers/places-controllers");
const checkAuth = require("../middleware/check-auth");

router.get("/:id", placesControllers.getPlaceById);

router.get("/user/:id", placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:id",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);
router.delete("/:id", placesControllers.deletePalce);

module.exports = router;
