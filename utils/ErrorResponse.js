"use strict"
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message)

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
        this.isOperatinal = true;
        Error.captureStackTrace(this, this.constructor)
    }
};

module.exports = ErrorResponse;