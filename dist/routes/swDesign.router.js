import { Router } from "express";
import SwDesign from "../controllers/swDesign";
export class SwDesignRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    getResults(req, res, next) {
        const defaultInput = {};
        const inputs = (Object.keys(req.body).length === 0) ? defaultInput : req.body;
        const process = new SwDesign(inputs);
        res.send({ results: process.calc });
    }
    init() {
        this.router.post('/swdesign', this.getResults);
    }
}
const swDesign = new SwDesignRouter();
swDesign.init();
export default swDesign.router;
