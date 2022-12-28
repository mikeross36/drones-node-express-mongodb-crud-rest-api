"use strict"

class QueryPrefill {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filterFind() {
        const queryObj = { ...this.queryString }
        const excludes = ["page", "sort", "limit", "fields"]
        excludes.forEach(field => delete queryObj[field])

        let queryObjStr = JSON.stringify(queryObj)
        queryObjStr = queryObjStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => {
            return `$${match}`
        });
        const queryObjReg = JSON.parse(queryObjStr)
        this.query = this.query.find(queryObjReg)

        return this;
    }

    sortBy() {
        if (this.queryString.sort) {
            const sorted = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sorted)
        }
        else {
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }

    selectFields() {
        if (this.queryString.field) {
            const fields = this.queryString.fields.split(",").join(" ")
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select("-__v")
        }
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.limit(limit).skip(skip)
        return this;
    }
};

module.exports = QueryPrefill;