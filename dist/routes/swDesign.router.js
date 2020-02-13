"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swDesign_1 = require("../controllers/swDesign");
class SwDesignRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getResults(req, res, next) {
        const defaultInput = {};
        const inputs = (Object.keys(req.body).length === 0) ? defaultInput : req.body;
        const process = new swDesign_1.default(inputs);
        res.send({ results: process.calc });
    }
    init() {
        this.router.post('/swdesign', this.getResults);
    }
}
exports.SwDesignRouter = SwDesignRouter;
const swDesign = new SwDesignRouter();
swDesign.init();
exports.default = swDesign.router;
