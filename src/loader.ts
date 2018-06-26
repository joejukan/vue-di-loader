import {getOptions} from "loader-utils"
import validateOptions = require("schema-utils");
import {ASTClass} from "./classification"
import { schema } from "./globalization";

function load(content: string);
function load(this: Context, content: string){
    let options = getOptions(this);
    this.cacheable();
    validateOptions(schema, options, 'wave-loader');
    
    let ast = new ASTClass(this.resourcePath);
    ast.load(content);
    
    return ast.javascript;
}
export default load;