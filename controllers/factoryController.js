"use strict"
const poseCatch = require("./../utils/poseCatch")
const ErrorResponse = require("./../utils/ErrorResponse")
const QueryPrefill = require("./../utils/QueryPrefill")

exports.deleteOne = Model => {
    return poseCatch(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            return next(new ErrorResponse("Document not found!", 404))
        }
        res.status(204).json({
            status: "success",
            data: null
        })
    })
};

exports.updateOne = Model => {
    return poseCatch(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body)
        if (!doc) {
            return next(new ErrorResponse("Document not found!", 404))
        }
        res.status(200).json({
            status: "success",
            data: {
                data: doc
            }
        })
    })
};

exports.createOne = Model => {
    return poseCatch(async (req, res, next) => {
        const doc = await Model.create(req.body)
        if (!doc) {
            return next(new ErrorResponse("Document not found!", 404))
        }
        res.status(200).json({
            status: "success",
            data: {
                data: doc
            }
        })
    })
};

exports.getOne = (Model, populateOptions) => {
    return poseCatch(async (req, res, next) => {
        let query = Model.findById(req.params.id)

        if (populateOptions) query = query.populate(populateOptions)
        const doc = await query;
        
        if (!doc) {
            return next(new ErrorResponse("Document not found!", 404))
        }
        res.status(200).json({
            status: "success",
            data: {
                data: doc
            }
        })
    })
};

exports.getAll = Model => {
    return poseCatch(async (req, res, next) => {
        let hasDrone = {};
        if (req.params.droneId) hasDrone = { drone: req.params.droneId }
        
        const prefill = new QueryPrefill(Model.find(hasDrone), req.query)
            // .filterFind()
            .sortBy()
            .selectFields()
            .paginate();

        const doc = await prefill.query;

        if (!doc) {
            return next(new ErrorResponse("Document not found!", 404))
        }
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                data: doc
            }
        })
    })
};