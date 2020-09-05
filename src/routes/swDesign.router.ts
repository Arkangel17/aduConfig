import { NextFunction, Request, Response, Router } from "express";
import SwDesign from "../controllers/swDesign";

export class SwDesignRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public getResults( req: Request, res: Response, next: NextFunction){

        const defaultInput = {
            
            avgHt: 10.58,
            length: 5.42,
            maxOpeningHeight: null, 
            sheathing: "STRUCT1", 
            dblSided: "TRUE", 
            sheathingThickness: "3/8", 
            nailingType: "6d", 
            edgeNailing: "6"

        }

        const inputs = ( Object.keys(req.body).length === 0 ) ? defaultInput : req.body;

        const process = new SwDesign(inputs);

        res.send({ results: process.calc() });
    }


    public init() {
        this.router.post('/', this.getResults)
    }

}

const swDesignRouter = new SwDesignRouter();
swDesignRouter.init();

export default swDesignRouter.router;