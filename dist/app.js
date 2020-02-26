"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const swDesign_router_1 = require("./routes/swDesign.router");
const roofLiveLoad_router_1 = require("./routes/roofLiveLoad.router");
const structApis_router_1 = require("./routes/structApis.router");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    //configure express middleware... 
    middleware() {
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
        this.express.use('/', express.static(path.join(__dirname, 'views')));
    }
    routes() {
        const router = express.Router();
        router.get('/', (req, res, next) => {
            res.sendFile(path.join(__dirname, '/views/index/index.html'));
        });
        this.express.use('/', router);
        //Api routes....
        this.express.use('/swDesign', swDesign_router_1.default);
        this.express.use('/roofLiveLoad', roofLiveLoad_router_1.default);
        this.express.use('/structApis', structApis_router_1.default);
    }
}
exports.default = new App().express;
