import { NextFunction, Request, Response, Router } from "express";
import RoofLiveLoad from "../controllers/roofLiveLoad";


export class RoofLiveLoadRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public getResults( req: Request, res: Response, next: NextFunction){

        const defaults = {
            areaTrib: 10,
            rise: 5
        }

        const input = ( Object.keys(req.body).length === 0 ) ? defaults : req.body;

        const process = new RoofLiveLoad( input.areaTrib, input.rise);
        
        res.send({ results: process.calc() });
    }

    public init() {
        this.router.post('/', this.getResults);
    }

}

const roofLiveLoad = new RoofLiveLoadRouter();
roofLiveLoad.init();

export default roofLiveLoad.router;
