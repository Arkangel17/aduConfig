import { NextFunction, Request, Response, Router } from "express";
import Hazards from "../controllers/hazards";

export class HazardsRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public getResults( req: Request, res: Response, next: NextFunction){

        const process = new Hazards();

        res.send({ results: process.calc });
    }


    public init() {
        this.router.post('/', this.getResults)
    }

}

const hazardsRouter = new HazardsRouter();
hazardsRouter.init();

export default hazardsRouter.router;