"use strict"
const jwt = require("jsonwebtoken")
const poseCatch = require("./../utils/poseCatch")
const ErrorResponse = require("./../utils/ErrorResponse")
const User = require("./../models/userModel")
const Email = require("./../utils/email")
const crypto = require("crypto")
const util = require("util")

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const sendGeneratedToken = (user, req, res, statusCode) => {
    const token = generateToken(user._id)
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user: user
        }
    })
};

exports.signup = poseCatch(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    if (!newUser) {
        return next(new ErrorResponse("User not created!", 400))
    }
    const url = `${req.protocol}://${req.get("host")}/me`;
    await new Email(newUser, url).sendWelcomeEmail();

    sendGeneratedToken(newUser, req, res, 201)
});

exports.login = poseCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Provide email or password!", 401))
    }
    async function checkUser() {
        const user = await User.findOne({ email: email }).select("+password")

        if (!user || !(await user.matchPassword(password, user.password))) {
            return next(new ErrorResponse("Incorrect email or password!", 401))
        }
        return user;
    }
    const user = await checkUser()

    sendGeneratedToken(user, req, res, 200)
});

exports.logout = (req, res) => {
    res.cookie("jwt", "forlogout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: "success" })
};

exports.forgotPassword = poseCatch(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorResponse("There is no user with this email!", 404))
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })
   
    try {
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
        await new Email(user, resetUrl).sendPasswordReset();
        
        res.status(200).json({
            status: "success",
            message: "Token sent by email"
        })
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })
        
        return next(new ErrorResponse("There was an error sending email. Try again latter", 500))
    }
});

exports.resetPassword = poseCatch(async (req, res, next) => {
    const resetTokenString = req.params.token;
    const hashResetToken = crypto.createHash("sha256").update(resetTokenString).digest("hex")

    async function getUser() {
        const user = await User.findOne({
            passwordResetToken: hashResetToken,
            passwordResetExpires: {$gt: Date.now()}
        })
        return user;
    }
    const user = await getUser()
    if (!user) {
        return next(new ErrorResponse("User not found!", 404))
    }
    async function setNewPassword() {
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save()
    }
    await setNewPassword();
    sendGeneratedToken(user, req, res, 200)
})

exports.tokenProtect = poseCatch(async (req, res, next) => {
    async function checkToken() {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new ErrorResponse("You are not logged in!", 401))
        }
        const verified = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
        return verified;
    }
    const verified = await checkToken()
    console.log(verified)

    async function checkUser() {
        const currUser = await User.findById(verified.id)
        if (!currUser) {
            return next(new ErrorResponse("User not found!", 404))
        }
        if (currUser.changedPasswordAfter(verified.iat)) {
            return next(new ErrorResponse("Password has changed! Login again", 401))
        }
        return currUser;
    }
    const currUser = await checkUser()
    req.user = currUser;

    res.locals.user = currUser;
    next()
});

exports.updatePassword = poseCatch(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.matchPassword(req.body.loginPassword, user.password);
    
    if (!isMatch) {
        return next(new ErrorResponse("Incorrect password!", 401))
    }

    async function setNewPassword() {
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save()
    }

    await setNewPassword()
    sendGeneratedToken(user, req, res, 200)
});

exports.restrictTo = (...userRoles) => {
    return (req, res, next) => {
        if (!userRoles.includes(req.user.role)) {
            return next(new ErrorResponse("You have not perimission to preform this action!", 401))
        }
        next()
    }
};

// frontend
exports.isUserLoggendIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const verified = await util.promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            const currUser = await User.findById(verified.id)
            if (!currUser) {
                return next()
            }
            if (currUser.changedPasswordAfter(verified.iat)) {
                return next()
            }
            res.locals.user = currUser;
            return next()
        }
        catch (error) {
            return next()
        }
    }
    next()
};