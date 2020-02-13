"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var roofLiveLoad_1 = require("../controllers/roofLiveLoad");
var roofLiveLoadRouter = /** @class */ (function () {
    function roofLiveLoadRouter() {
        this.router = express_1.Router();
        this.init();
    }
    roofLiveLoadRouter.prototype.getResults = function (req, res, next) {
        var defaults = {
            areaTrib: 10,
            rise: 5
        };
        var inputs = (Object.keys(req.body).length === 0) ? defaults : req.body;
        var process = new roofLiveLoad_1.default(defaults.areaTrib, defaults.rise);
        res.send({ results: process.calc });
    };
    roofLiveLoadRouter.prototype.init = function () {
        this.router.post('/liveload', this.getResults);
    };
    return roofLiveLoadRouter;
}());
exports.roofLiveLoadRouter = roofLiveLoadRouter;
var roofLiveLoad = new roofLiveLoadRouter();
roofLiveLoad.init();
exports.default = roofLiveLoad.router;
