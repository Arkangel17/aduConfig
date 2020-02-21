import { NextFunction, Request, Response, Router } from "express";
import Hazards from "../controllers/hazards";

export class HazardsRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public getResults( req: Request, res: Response, next: NextFunction){

        const body = req.body 
        const inputs = (Object.keys(body).length === 0) ? {} : body;
        const process = new Hazards(inputs);

        res.send({ results: process.calc });
    }


    public init() {
        this.router.post('/hazards', this.getResults)
    }

}

const hazardsRouter = new HazardsRouter();
hazardsRouter.init();

export default hazardsRouter.router;