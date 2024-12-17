const joi = require("joi");

const listingSchemaJoi = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required(),
        image: joi.object({
            url: joi.string().uri().required(),
            filename: joi.string().required(),
        }).required(),
    }).required()
});

const reviewSchemaJoi = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
});

module.exports = {
    listingSchemaJoi, reviewSchemaJoi,
};
