"use strict"
const path = require("path")
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const ErrorResponse = require("./utils/ErrorResponse")
const GlobalErrorHandler = require("./utils/globalErrorHandler")

const droneRouter = require("./routes/droneRoutes")
const userRouter = require("./routes/userRoutes")
const reviewRouter = require("./routes/reviewReoutes")
const featuredRouter = require("./routes/featuredRoutes")
const preorderRouter = require("./routes/preorderRoutes")
const viewsRouter = require("./routes/viewsRoutes")

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// global middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(function(req, res, next) { 
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://js.stripe.com/v3/"); 
    return next(); 
});

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: "Too many requests from this IP address! Try again in an hour"
});
app.use("/api", limiter)

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({
    whitelist: ["ratingsQuantity", "ratingsAverage", "difficulty", "price"]
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toLocaleDateString()
    // console.log(req.cookies)
    next()
});

// routes
app.use("/", viewsRouter)
app.use("/api/v1/drones", droneRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/featured", featuredRouter)
app.use("/api/v1/preorders", preorderRouter)

app.all("*", (req, res, next) => {
    next(new ErrorResponse(`Cannot find ${req.originalUrl} on this server!`, 404))
})

app.use(GlobalErrorHandler)

module.exports = app;