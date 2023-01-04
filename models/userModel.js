"use strict"
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const validator = require("validator")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is mandatory"]
        },
        email: {
            type: String,
            required: [true, "Email is mandatory"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Email is not valid!"]
        },
        photo: {
            type: String,
            default: "default.jpg"
        },
        role: {
            type: String,
            enum: ["user", "admin", "pilot"],
            default: "user"
        },
        password: {
            type: String,
            required: [true, "Password is mandatory"],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password!"],
            validate: {
                validator: function (value) {
                    return value === this.password
                },
                message: "Passwords do not match!"
            }
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        passwordChangedAt: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound)
    this.password = await bcrypt.hash(this.password, salt)

    this.passwordConfirm = undefined;
    next()
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next()
});

userSchema.methods.matchPassword = async function (loginPassword, userPassword) {
    const isMatch = await bcrypt.compare(loginPassword, userPassword)
    return isMatch;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetTokenString = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetTokenString).digest("hex")
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetTokenString;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false;
};

const User = mongoose.model("User", userSchema)

module.exports = User;