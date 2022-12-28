"use strict"
const ErrorResponse = require("./ErrorResponse")

const sendDevError = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }
    console.error("ERROR!", err)
    return res.status(err.statusCode).render("error", {
        title: "Somethig went wrong!",
        message: err.message
    })
};

const sendProdError = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        console.error("ERROR!", err)
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!"
        })
    }

    if (err.isOperational) {
        console.log(err)
        return res.status(err.statusCode).render("error", {
            title: "Somthing went wrong!",
            message: err.message
        })
    }
    console.error("ERROR!", err)
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        message: "Please try again later"                                                                                                                                                                                                                                                                                                                                                                                                     
    })              
};   

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ErrorResponse(message, 400)
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please choose another value`
    return new ErrorResponse(message, 400)
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(value => {
        return value.message;
    })
    const message = `Invalid input data: ${errors.join(", ")}`;
    return new ErrorResponse(message, 400)
};

const handleJWTError = () => {
    return new ErrorResponse("Invalid token. Please login again", 400)
};

const handleJWTExpiredError = () => {
    return new ErrorResponse("Your token has expired! Please login again", 400)
}

module.exports = (err, req, res, next) => {                                 
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";                                                                                                                                                                                                     
                              
    if (process.env.NODE_ENV === "development") {
        sendDevError(err, req, res)                                       
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err }
        error.message = err.message;

        if (error.name === "CastError") error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === "validationError") error = handleValidationErrorDB(error)
        if (error.name === "JsonWebTokenError") error = handleJWTError()
        if(error.name === "TokenExpiredError") error = handleJWTExpiredError()
        
        sendProdError(err, req, res)
    }                                                                                                            
};