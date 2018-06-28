import {getOptions} from "loader-utils"
import validateOptions = require("schema-utils");
import {ASTClass} from "./classification"
import { schema } from "./globalization";
export { pitch } from "./function";

function load(content: string);
function load(this: Context, content: string){
    let options = getOptions(this);
    this.cacheable();
    validateOptions(schema, options, 'vue-di-loader');
    
    let ast = new ASTClass(this.resourcePath);
    ast.load(content);
    
    return ast.javascript;
}
export default load;