const User = require("../models/user");


module.exports.signupForm = (request, response) => {
    response.render("user/signup.ejs");
}


module.exports.signupResponse = async (request, response, next) => {

    try {
        let { username, email, password } = request.body;
        const newUser = new User({ email, username });

        const RegisteredUser = await User.register(newUser, password);

        request.login(RegisteredUser, (error) => {
            if (error) {
                return next(error);
            }

            request.flash("success", `${RegisteredUser.username} Your registration is successfully completed`);
            response.redirect(response.locals.redirectUrlLocalVariable || '/listings');
        })

    } catch (error) {
        request.flash("warning", error.message);
        response.redirect('/signup');
    }
}

module.exports.loginForm = (request, response) => {
    response.render("user/login.ejs");
}


module.exports.loginFormResponse = (request, response) => {
    request.flash("success", "Welcome back to YDP World");
    response.redirect(response.locals.redirectUrlLocalVariable || '/listings');
}


module.exports.logoutUser = (request, response, next) => {
    request.logout((error) => {
        if (error) {
            return next(error);
        }
        request.flash("success", "you logged out now");
        response.redirect("/listings");
    })
}