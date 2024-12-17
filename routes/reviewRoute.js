const { validateReview } = require("../middlewares/schemaValidation");
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controller/reviewController");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthor } = require("../middlewares/userMiddlewares");



router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.ReviewResponse))

// delete reviews
router.delete("/:rid", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;