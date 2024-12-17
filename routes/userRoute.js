const wrapAsync = require("../utils/wrapAsync");
const UserController = require("../controller/userController");
const express = require("express");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/userMiddlewares");
const router = express.Router();


router.get("/signup", UserController.signupForm);

router.post("/signup",saveRedirectUrl, wrapAsync(UserController.signupResponse));

router.get("/login", UserController.loginForm);

router.post("/login",saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}
), wrapAsync(UserController.loginFormResponse));


router.get("/logout", UserController.logoutUser);


module.exports = router;