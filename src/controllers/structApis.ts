
`use strict`

import axios from 'axios';

import apiKeys from '../apiKeys'

class StructAPIs { 
    
    public usgsURL: string = `https://earthquake.usgs.gov/ws/designmaps/asce7-10.json`;
    public geoCodeURL: string = `https://maps.googleapis.com/maps/api/geocode/json?`;
    public medeekApiURL: string = `http://design.medeek.com/resources/medeekapi.pl?`;
    public formValues: any = {};
    public results: any = {};
    public googleApiKey = apiKeys['usgsSeisAPI']


    constructor(formValues: any){
        this.formValues = formValues;

    }
    

    public calc (): any {

       let geo: any =  this.getLatLongFromAddress(this.geoCodeURL, this.formValues.address, this.googleApiKey);

       let seis: any = this.usgsApiRequest(geo, this.formValues.riskCategory, this.formValues.siteClass, this.formValues.title);

       let snow: any = this.getMedeekWindSpeed(this.medeekApiURL, geo);

       let wind: any = this.getMedeekGrdSnowLoad(this.medeekApiURL, geo);

       this.results = {
           geo,
           seis,
           snow,
           wind
       }

       return this.results

    }

    public async getLatLongFromAddress(geoCodeURL: string, address: string, googleApiKey: string) {

        let res: object;
        let latLongObj: object;

        try {
            res = await axios.get(geoCodeURL, {
                params: {
                    address,
                    key: googleApiKey
                }
            });

            latLongObj = this.getLatLong(res)
            return latLongObj;
        }catch(e){
            console.log(`google latlong error`);
        }
    }

    public getLatLong(res: any): object {
        let latLong: object;
        latLong = res.data.results[0].geometry.location;
        return latLong;
    }
    

    
    public async usgsApiRequest(geo: object, riskCategory: string, siteClass: string,  title: string) {

        let res: any; 

        try {
            //need to figure out to implement asce7-16 into the usgsURL...
            res =  await axios.get(this.usgsURL, {
                params: {
                  latitude: geo,
                  longitude: geo,
                  riskCategory,
                  siteClass,
                  title
                }
            })
            let { data } = res.data;
            return data;
        }catch(err) {
            console.log(`usgs error`)
        } 
    }

    public async getMedeekWindSpeed(medeekApiURL: string, geo: object, asce7Code?: string) {

        let res: any;

        try{
           res = await axios.get(medeekApiURL, {
                params: {
                  lat: geo,
                  lng: geo,
                  output: 'json',
                  action: 'asce710wind',
                  key: 'MEDEEK13522911'
                }
              })
              return res
        }catch(e){
            console.log(`medeek wind api error`)
        }
    }


    public async getMedeekGrdSnowLoad(medeekApiURL: string, geo: object) {

        let res: any;

        try { 
            res = await axios.get(medeekApiURL, {
            params: {
              lat: geo,
              lng: geo,
              output: 'json',
              action: 'ascesnow',
              key: 'MEDEEK13522911'
            }            
          })
          return res;

        }catch(e){
            console.log(`medeek snow api error`);
        }
      }

}
export default StructAPIs
