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

        }

        const inputs = ( Object.keys(req.body).length === 0 ) ? defaultInput : req.body;

        const process = new SwDesign(inputs);

        res.send({ results: process.calc });
    }


    public init() {
        this.router.post('/swdesign', this.getResults)
    }

}

const swDesign = new SwDesignRouter();
swDesign.init();

export default swDesign.router;