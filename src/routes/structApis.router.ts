import { NextFunction, Request, Response, Router } from "express";
import StructAPIs from "../controllers/structApis";

export class StructApisRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public getResults(req: Request, res: Response, next: NextFunction){

        const body = req.body 
        const inputs = (Object.keys(body).length === 0) ? {} : body;

        const process = new StructAPIs(inputs);
        process.calc().then( data => {
            res.send(data)
        })
    }


    public init() {
        this.router.post('/', this.getResults)
    }

}

const structApisRouter = new StructApisRouter();
structApisRouter.init();

export default structApisRouter.router;