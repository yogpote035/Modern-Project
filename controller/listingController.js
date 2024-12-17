const Listing = require("../models/listings");
const { listingSchemaJoi } = require("../schema");

module.exports.index = (async (request, response) => {
    let AllListings = await Listing.find({});

    if (!AllListings) {
        request.flash("error", "listing not found");

    }
    response.render("listings/showAll.ejs", { AllListings });
});


module.exports.RenderNewForm = (request, response) => {

    response.render("listings/new.ejs");
}


module.exports.NewListingResponse = (async (request, response, next) => {
    listingSchemaJoi.validate(request.body.listing);
    let url = request.file.path;
    let filename = request.file.filename;
    let newListing = new Listing({
        ...request.body.listing
    })
    newListing.owner = request.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    request.flash("success", "listing Created successfully");

    response.redirect('/listings');
})


module.exports.renderEditForm = (async (request, response, next) => {
    let { id } = request.params;
    if (!id) {
        request.flash("error", "id not found");
    }
    let listing = await Listing.findById(id);

    response.render("listings/edit.ejs", { listing });


})
module.exports.EditFormResponse = (async (request, response, next) => {
    let { id } = request.params;

    listingSchemaJoi.validate(request.body.listing);

    let listing = await Listing.findByIdAndUpdate(id, {
        ...request.body.listing
    })

    if (typeof request.file !== 'undefined') {
        let url = request.file.path;
        let filename = request.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    request.flash("warning", "listing Updated successfully");

    response.redirect(`/listings/${id}`);
})
module.exports.deleteListing = (async (request, response, next) => {
    let { id } = request.params;

    await Listing.findByIdAndDelete(id);
    request.flash("error", "listing deleted successfully");

    response.redirect("/listings");
})
module.exports.ShowOne = (async (request, response, next) => {
    let { id } = request.params;
    let AllListings = await Listing.findById(id).populate(
        {
            path: "reviews",
            populate: {
                path: "author",
            },
        }
    ).populate("owner");
    if (!AllListings) {
        request.flash("error", "listing not found");
    }
    response.render("listings/show.ejs", { AllListings });
})
