"use strict"
const mongoose = require("mongoose")
const dotenv = require("dotenv")

process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION! Shutting down...")
    console.log(err.name, err.message)
    process.exit(1)
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.set('strictQuery', true); 

mongoose.connect(DB).then(() => console.log("Database connected successfully"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`App is running on port ${port}...`));

process.on("unhandledRejection", err => {
    console.log("UNHANDLED REJECTION!. Shutting down...")
    console.log(err.error, err.message)
    server.close(() => {
        process.exit(1)
    })
});

process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED. Shuttin down gracefull");
    server.close(() => {
        console.log("Process terminated!")
    })
})