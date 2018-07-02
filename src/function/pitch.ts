import {ASTClass, VueDIPlugin} from "../classification";
import {configuration} from "../globalization";

export function pitch(this: Context, remainingPath, precedingPath, data: {[key: string]: any}){
    if(!configuration.pitched && /\.vue$/i.test(remainingPath)){
        let ast = new ASTClass();
        ast.pitch(remainingPath);
    }
}