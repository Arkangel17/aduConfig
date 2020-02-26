import * as bodyParser from "body-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";


import SwDesignRouter from "./routes/swDesign.router";
import RoofLiveLoadRouter from "./routes/roofLiveLoad.router";
import StructApisRouter from "./routes/structApis.router";


class App {

    // ref to Express Instance
    public express: express.Application;

    constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    }

    //configure express middleware... 
    private middleware(): void {
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

    private routes(): void {
        const router = express.Router();
        
        router.get('/', (req, res, next) =>{
            res.sendFile(path.join(__dirname, '/views/index/index.html'));  
        });

        this.express.use('/', router);

        //Api routes....
        this.express.use('/swDesign', SwDesignRouter);
        this.express.use('/roofLiveLoad', RoofLiveLoadRouter);  
        this.express.use('/structApis', StructApisRouter);
    }
}

export default new App().express;
