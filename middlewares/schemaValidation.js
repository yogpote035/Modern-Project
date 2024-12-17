const { listingSchemaJoi, reviewSchemaJoi } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const validateListing = (request, response, next) => {
    const { error } = listingSchemaJoi.validate(request.body);
    if (error) {
        throw new ExpressError(400, error.details.map((e) => e.message).join(", "));
    } else {
        next();
    }
};

const validateReview = (request, response, next) => {
    const { error } = reviewSchemaJoi.validate(request.body);
    if (error) {
        throw new ExpressError(400, error.details.map((e) => e.message).join(", "));
    } else {
        next();
    }
};

module.exports = { validateListing, validateReview };
