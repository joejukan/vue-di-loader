import { configuration } from "../globalization";

export function log(value: any){
    if(configuration.verbose){
        console.log(`[vue-di-loader] ${value}`);
    }
}