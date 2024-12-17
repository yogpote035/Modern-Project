const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.isLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {

        // create var in session object
        request.session.redirectUrl = request.originalUrl;

        request.flash("warning", "you must be login to create listing");
        return response.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (request, response, next) => {
    if (request.session.redirectUrl) {
        // user.session
        response.locals.redirectUrlLocalVariable = request.session.redirectUrl;
    }
    next();
}



module.exports.isOwner = async (request, response, next) => {
    let { id } = request.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(response.locals.CurrentUser._id)) {
        request.flash("error", "Your not owner of this listing");
        return response.redirect(`/listings/${id}`)
    }
    next();

}



module.exports.isAuthor = async (request, response, next) => {
    let { id, rid } = request.params;
    let review = await Review.findById(rid);

    if (!review.author._id.equals(response.locals.CurrentUser._id)) {
        request.flash("error", "Your not author of this review");
        return response.redirect(`/listings/${id}`);
    }
    next();

}


