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
        const defaultInput = {
            avgHt: 10.58,
            length: 5.42,
            maxOpeningHeight: null,
            sheathing: "STRUCT1",
            dblSided: "TRUE",
            sheathingThickness: "3/8",
            nailingType: "6d",
            edgeNailing: "6"
        };
        const inputs = (Object.keys(req.body).length === 0) ? defaultInput : req.body;
        const process = new swDesign_1.default(inputs);
        res.send({ results: process.calc() });
    }
    init() {
        this.router.post('/', this.getResults);
    }
}
exports.SwDesignRouter = SwDesignRouter;
const swDesignRouter = new SwDesignRouter();
swDesignRouter.init();
exports.default = swDesignRouter.router;
