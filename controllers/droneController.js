"use strict"
const factory = require("./factoryController")
const Drone = require("./../models/droneModel")

exports.getAllDrones = factory.getAll(Drone)
exports.getDrone = factory.getOne(Drone, {path: "reviews"})
exports.createDrone = factory.createOne(Drone)
exports.updateDrone = factory.updateOne(Drone)
exports.deleteDrone = factory.deleteOne(Drone)