const mongoose = require("mongoose");
const Reviews = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    location: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Reviews.deleteMany({ _id: { $in: listing.reviews } });
    }
})


module.exports = mongoose.model("Listing", listingSchema);