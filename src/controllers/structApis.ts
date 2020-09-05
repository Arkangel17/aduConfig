
`use strict`

import axios from 'axios';
import ApiKeys from '../apiKeys';

class StructAPIs { 
    
    public usgsUrlBase: string = `https://earthquake.usgs.gov/ws/designmaps/`;
    public geoCodeURL: string = `https://maps.googleapis.com/maps/api/geocode/json?`;
    public medeekApiURL: string = `http://design.medeek.com/resources/medeekapi.pl?`;
    public results: any = {};
    public googleApiKey: string;
    public medeekApiKey: string;
    public usgsURL: string;
   
    constructor(public formValues: any){
        this.formValues = formValues;          
        this.googleApiKey = ApiKeys.usgsSeisAPI;   
        this.medeekApiKey = ApiKeys.medeekAPI;
    }    

    public calc = async() => {

        return this.getLatLongFromAddress(this.geoCodeURL, this.formValues, this.googleApiKey)                    
            .then( latLong =>{
                let promises = [
                    this.usgsApiRequest(latLong, this.usgsUrlBase, this.formValues),
                    this.getMedeekWindSpeed(this.medeekApiURL, latLong, this.medeekApiKey),
                    this.getMedeekGrdSnowLoad(this.medeekApiURL, latLong, this.medeekApiKey), 
                    latLong,
                    this.formValues
                ]
    
                let promiseAll = Promise.all(promises).then( res =>{
                    let data = {
                        'seismic': res[0],
                        'wind': res[1],
                        'snow': res[2],
                        'geo': res[3],
                        'formValues': res[4]                       
                    }
                    console.log(data)   
                    return data                 
                })
                .catch(err =>{ console.log('usgsApiPromiseAllError:', err) })

                return promiseAll.then(data => data)

            })
            .catch(err =>{ console.log('overallError', err) })

    }
    

    private async getLatLongFromAddress(geoCodeURL: string, formValues: any, apiKey: string) {
        /**
        * @desc get radians and return degrees
        * @param degrees: number
        * @return the result of the convertion
        */

        let res: object;
        let latLongObj: object;        

        try {
            res = await axios.get(geoCodeURL, {
                params: {
                    address: formValues.address,
                    key: apiKey
                }
            });
            latLongObj = res['data']['results'][0]['geometry']['location'];
            console.log('latLongObj', latLongObj)
            return latLongObj;
        }catch(err){
            console.log(`getLatLongFromAddressError`, err);
        }
    }

    private async usgsApiRequest(geo: object, usgsUrlBase:string, formValues: any) {
        /**
        * @desc get radians and return degrees
        * @param degrees: number
        * @return the result of the convertion
        */

        let usgsURL = usgsUrlBase + formValues.asceCodeVers + '.json?'
        console.log('usgsURL', usgsURL);
        let res: any; 

        try {
            //need to figure out to implement asce7-16 into the usgsURL...
            res =  await axios.get(usgsURL, {
                params: {
                  latitude: geo['lat'],
                  longitude: geo['lng'],
                  riskCategory: formValues.riskCat,
                  siteClass: formValues.siteSoilClass,
                  title: formValues.projectName
                }
            })
            let { data } = res['data']['response']
            return data;
        }catch(err) {
            console.log('usgsApiRequestError', err)
        } 
    }

    private async getMedeekWindSpeed(medeekApiURL: string, geo: object, apiKey: string, asce7Code?: string) {
        /**
        * @desc get radians and return degrees
        * @param degrees: number
        * @return the result of the convertion
        */

        let res: any;
        let engrCode: string = ( asce7Code === 'asce7-10') ? 'asce710wind' : 'asce716wind';

        try{
           res = await axios.get(medeekApiURL, {
                params: {
                  lat: geo['lat'],
                  lng: geo['lng'],
                  output: 'json',
                  action: engrCode,
                  key: apiKey
                }
              })
            //   let { data } = res['data']['results']
              return res.data.results;
        }catch(err){
            console.log(`getMedeekWindSpeed`, err)
        }
    }

    private async getMedeekGrdSnowLoad(medeekApiURL: string, geo: object, apiKey: string) {
        /**
        * @desc get radians and return degrees
        * @param degrees: number
        * @return the result of the convertion
        */

        let res: any;

        try { 
            res = await axios.get(medeekApiURL, {
            params: {
              lat: geo['lat'],
              lng: geo['lng'],
              output: 'json',
              action: 'ascesnow',
              key: apiKey
            }            
          })
        //   let { data } = res['data']['results']
          return res.data.results;

        }catch(err){
            console.log(`getMedeekGrdSnowLoad`, err);
        }
      }

}
export default StructAPIs
