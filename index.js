if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
// for authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const path = require("path");
const port = 3000;
const app = express();
const flash = require("connect-flash");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));;

const ExpressError = require("./utils/ExpressError");

// middlewares
// settings path
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, ("/public/css"))));
app.use(express.static(path.join(__dirname, ("/public/js"))));
app.use(express.static(path.join(__dirname, ("/public/images"))));

const dbUrl = process.env.ATLAS_URL;
main().then(() => {
    console.log('connected to DB');
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}



const sessionOption = {
    secret: "sushila",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 + 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((request, response, next) => {
    response.locals.success = request.flash("success");
    response.locals.error = request.flash("error");
    response.locals.warning = request.flash("warning");
    response.locals.CurrentUser = request.user;
    next();
})

// importing route

const listingRouter = require("./routes/listingRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const UserRouter = require("./routes/userRoute.js");

app.all("/", (request, response) => {
    response.redirect("/listings");
})
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", UserRouter);




app.all("*", (request, response, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((error, request, response, next) => {
    let { message } = error;
    response.render("error.ejs", { message });
    // response.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`app started at port ${port}`);
})