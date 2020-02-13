'use strict'

class RoofLiveLoad {
    // set parameters for the constructor + class
    public areaTrib: number;
    public rise: number;
    public results: any;

    constructor( areaTrib: number, rise: number ) {
      this.areaTrib = areaTrib;
      this.rise = rise;
    }


    public calc(): any {
        
        const areaTrib = this.areaTrib;
        const rise = this.rise;
        
        return this.getRoofLiveLoad( areaTrib, rise );
    };


    private getRoofLiveLoad ( areaTrib: number , rise: number ){
        let res1: any;
        let res2: any;
        let res3: any;
        let res: any;
        let roofLive: number = 20;

        switch ( true ){
            case  areaTrib < 200 :
                res1 = 1.0;
            break;
            case  areaTrib > 200 && areaTrib < 600 :
                res1 = 1.2 - 0.001*areaTrib;
            break;
            case  areaTrib >= 600 :
                res1 = 0.6;
            break;
            default:
                res1 = 1.0
            break;
        }

        switch ( true ){
            case  rise <= 4.0 :
                res2 = 1.0;
            break;
            case  rise > 4.0 && rise <= 12 :
                res2 = 1.2 - 0.05*rise;
            break;
            case  rise >= 12 :
                res2 = 0.6;
            break;
            default:
                res2 = 1.0;
            break;
        }

        res3 = roofLive * res1 * res2

        res = ( res3 < 12 ) ? 12 : res3;
        
        return {
            Lo: roofLive,
            R1: res1,
            R2: res2,
            Lr: res   
        };

    }
}

export default RoofLiveLoad;