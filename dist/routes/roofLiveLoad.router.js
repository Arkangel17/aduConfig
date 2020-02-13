import { Router } from "express";
import RoofLiveLoad from "../controllers/roofLiveLoad";
export class roofLiveLoadRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    getResults(req, res, next) {
        const defaults = {
            areaTrib: 10,
            rise: 5
        };
        const inputs = (Object.keys(req.body).length === 0) ? defaults : req.body;
        const process = new RoofLiveLoad(defaults.areaTrib, defaults.rise);
        res.send({ results: process.calc });
    }
    init() {
        this.router.post('/liveload', this.getResults);
    }
}
const roofLiveLoad = new roofLiveLoadRouter();
roofLiveLoad.init();
export default roofLiveLoad.router;
