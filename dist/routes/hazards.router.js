"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hazards_1 = require("../controllers/hazards");
class HazardsRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getResults(req, res, next) {
        const body = req.body;
        const inputs = (Object.keys(body).length === 0) ? {} : body;
        const process = new hazards_1.default(inputs);
        res.send({ results: process.calc });
    }
    init() {
        this.router.post('/hazards', this.getResults);
    }
}
exports.HazardsRouter = HazardsRouter;
const hazardsRouter = new HazardsRouter();
hazardsRouter.init();
exports.default = hazardsRouter.router;
