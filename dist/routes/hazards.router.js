"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var hazards_1 = require("../controllers/hazards");
var HazardsRouter = /** @class */ (function () {
    function HazardsRouter() {
        this.router = express_1.Router();
        this.init();
    }
    HazardsRouter.prototype.getResults = function (req, res, next) {
        var process = new hazards_1.default();
        res.send({ results: process.calc });
    };
    HazardsRouter.prototype.init = function () {
        this.router.post('/', this.getResults);
    };
    return HazardsRouter;
}());
exports.HazardsRouter = HazardsRouter;
var hazardsRouter = new HazardsRouter();
hazardsRouter.init();
exports.default = hazardsRouter.router;
