import {ASTClass, VueDIPlugin} from "../classification";
import {dependencies} from "../globalization";

export function pitch(this: Context, remainingPath, precedingPath, data: {[key: string]: any}){
    if(!VueDIPlugin.pitched && /\.vue$/i.test(remainingPath)){
        let ast = new ASTClass();
        ast.pitch(remainingPath);
    }
}