"use strict"
const multer = require("multer")
const sharp = require("sharp")
const factory = require("./factoryController")
const User = require("./../models/userModel")
const ErrorResponse = require("../utils/ErrorResponse")
const poseCatch = require("./../utils/poseCatch")

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    const fieldNames = Object.keys(obj)
    fieldNames.forEach(field => {
        if (allowedFields.includes(field)) newObj[field] = obj[field];
    })
    return newObj;
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else {
        cb(new ErrorResponse("File is not an image!", 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo")

exports.resizeUserPhoto = poseCatch(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/images/users/${req.file.filename}`);

    next()
});

exports.updateMe = poseCatch(async (req, res, next) => {
    // console.log(req.file)
    if (req.body.password || req.body.passwordConfirm) {
        return next(new ErrorResponse("You cannot update your password!", 401))
    }
    async function setUpdates() {
        const filterBody = filterObj(req.body, "name", "email")
        if (req.file) filterBody.photo = req.file.filename;
        
        const updatedMe = await User.findByIdAndUpdate(req.user.id, filterBody, {
            new: true,
            runValidators: true
        })
        return updatedMe;
    }
    const updatedMe = await setUpdates();
    res.status(200).json({
        status: "success",
        data: {
            user: updatedMe
        }
    })
});

exports.deleteMe = poseCatch(async (req, res, next) => {
    const deletedMe = await User.findByIdAndUpdate(req.user.id, { active: false })
    if (!deletedMe) {
        return next(new ErrorResponse("User not found!", 404))
    }
    res.stauts(204).json({
        status: "success",
        data: null
    })
});

