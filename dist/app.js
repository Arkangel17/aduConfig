"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var swDesign_router_1 = require("./routes/swDesign.router");
var roofLiveLoad_router_1 = require("./routes/roofLiveLoad.router");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    //configure express middleware... 
    App.prototype.middleware = function () {
        this.express.use(morgan('dev'));
        /*
        Dev = predefined morgan format
        concise output colored by response status for dev use:
            :status token
                - red: server errors
                - yellow: client errors
                - cyan: redirection errors
                - else: uncolored...
        */
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use('/', express.static(path.join(__dirname, 'src')));
        this.express.use('/', express.static(path.join(__dirname, 'controllers')));
    };
    App.prototype.routes = function () {
        var router = express.Router();
        router.get('/', function (req, res, next) {
            res.sendFile(path.join(__dirname + '/views/gethazards/gethazards.html'));
        });
        this.express.use('/', router);
        //Api routes....
        this.express.use('/swDesign', swDesign_router_1.default);
        this.express.use('/roofLiveLoad', roofLiveLoad_router_1.default);
    };
    return App;
}());
exports.default = new App().express;
