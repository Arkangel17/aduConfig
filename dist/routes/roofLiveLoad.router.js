"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roofLiveLoad_1 = require("../controllers/roofLiveLoad");
class roofLiveLoadRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getResults(req, res, next) {
        const defaults = {
            areaTrib: 10,
            rise: 5
        };
        const inputs = (Object.keys(req.body).length === 0) ? defaults : req.body;
        const process = new roofLiveLoad_1.default(defaults.areaTrib, defaults.rise);
        res.send({ results: process.calc });
    }
    init() {
        this.router.post('/liveload', this.getResults);
    }
}
exports.roofLiveLoadRouter = roofLiveLoadRouter;
const roofLiveLoad = new roofLiveLoadRouter();
roofLiveLoad.init();
exports.default = roofLiveLoad.router;
