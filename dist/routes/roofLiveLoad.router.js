"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roofLiveLoad_1 = require("../controllers/roofLiveLoad");
class RoofLiveLoadRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getResults(req, res, next) {
        const defaults = {
            areaTrib: 10,
            rise: 5
        };
        const input = (Object.keys(req.body).length === 0) ? defaults : req.body;
        const process = new roofLiveLoad_1.default(input.areaTrib, input.rise);
        res.send({ results: process.calc() });
    }
    init() {
        this.router.post('/', this.getResults);
    }
}
exports.RoofLiveLoadRouter = RoofLiveLoadRouter;
const roofLiveLoad = new RoofLiveLoadRouter();
roofLiveLoad.init();
exports.default = roofLiveLoad.router;
