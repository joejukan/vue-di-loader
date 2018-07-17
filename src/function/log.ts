import { configuration } from "../globalization";
import * as moment from "moment";

export function log(value: any){
    if(configuration.verbose){
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        console.log(`[${now}][vue-di-loader] ${value}`);
    }
}