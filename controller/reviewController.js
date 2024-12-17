const Listing = require("../models/listings");
const Review = require("../models/review");
const { reviewSchemaJoi } = require("../schema");

module.exports.ReviewResponse = (async (request, response) => {
    let listing = await Listing.findById(request.params.id);
    reviewSchemaJoi.validate(request.body);
    let newReview = new Review(request.body.review);
    newReview.author = request.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    request.flash("success", "review added successfully");
    response.redirect(`/listings/${request.params.id}`);
})

module.exports.deleteReview = (async (request, response) => {
    let { id, rid } = request.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    request.flash("error", "review Deleted successfully");

    response.redirect(`/listings/${request.params.id}`);
})


