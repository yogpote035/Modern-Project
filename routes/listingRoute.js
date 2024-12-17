const express = require("express");
const router = express.Router();
const { validateListing } = require("../middlewares/schemaValidation");
const wrapAsync = require("../utils/wrapAsync");

const listingController = require("../controller/listingController");
const { isLoggedIn, isOwner } = require("../middlewares/userMiddlewares");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig");
const upload = multer({ storage });
// show all listings
router.get("/", wrapAsync(listingController.index));


// create new listings [in two steps];

// 1st render form of input
router.get("/new", isLoggedIn, listingController.RenderNewForm);

// 2nd step get form response
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.NewListingResponse));


// update listings in two step
// 1st step render edit form with previous
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// step 2 get response
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.EditFormResponse));


router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));






// show one[specific]
router.get("/:id", wrapAsync(listingController.ShowOne));



module.exports = router;