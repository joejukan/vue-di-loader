import {ASTClass} from "../classification";
import {dependencies} from "../globalization";

export function pitch(this: Context, remainingPath, precedingPath, data: {[key: string]: any}){
    let ast = new ASTClass();
    ast.pitch(remainingPath);
}