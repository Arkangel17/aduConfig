"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const structApis_1 = require("../controllers/structApis");
class StructApisRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getResults(req, res, next) {
        const body = req.body;
        const inputs = (Object.keys(body).length === 0) ? {} : body;
        const process = new structApis_1.default(inputs);
        process.calc().then(data => {
            res.send(data);
        });
    }
    init() {
        this.router.post('/', this.getResults);
    }
}
exports.StructApisRouter = StructApisRouter;
const structApisRouter = new StructApisRouter();
structApisRouter.init();
exports.default = structApisRouter.router;
