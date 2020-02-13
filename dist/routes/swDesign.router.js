"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var swDesign_1 = require("../controllers/swDesign");
var SwDesignRouter = /** @class */ (function () {
    function SwDesignRouter() {
        this.router = express_1.Router();
        this.init();
    }
    SwDesignRouter.prototype.getResults = function (req, res, next) {
        var defaultInput = {};
        var inputs = (Object.keys(req.body).length === 0) ? defaultInput : req.body;
        var process = new swDesign_1.default(inputs);
        res.send({ results: process.calc });
    };
    SwDesignRouter.prototype.init = function () {
        this.router.post('/swdesign', this.getResults);
    };
    return SwDesignRouter;
}());
exports.SwDesignRouter = SwDesignRouter;
var swDesignRouter = new SwDesignRouter();
swDesignRouter.init();
exports.default = swDesignRouter.router;
