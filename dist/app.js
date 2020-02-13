import * as bodyParser from "body-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";
import SwDesignRouter from "./routes/swDesign.router";
import RoofLiveLoadRouter from "./routes/roofLiveLoad.router";
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
        this.express.use('/', express.static(path.join(__dirname, 'src')));
        this.express.use('/', express.static(path.join(__dirname, 'controllers')));
    }
    routes() {
        const router = express.Router();
        router.get('/', (req, res, next) => {
            res.sendFile(path.join(__dirname + '/views/gethazards/gethazards.html'));
        });
        this.express.use('/', router);
        //Api routes....
        this.express.use('/swDesign', SwDesignRouter);
        this.express.use('/roofLiveLoad', RoofLiveLoadRouter);
    }
}
export default new App().express;
