import {getOptions} from "loader-utils"
import validateOptions = require("schema-utils");
import {ASTClass, VueDIPlugin} from "./classification"
import { schema } from "./globalization";

export { pitch } from "./function";
export { VueDIPlugin } from "./classification";

function load(content: string);
function load(this: Context, content: string){
    let options = getOptions(this);
    let entries = VueDIPlugin.entries;
    this.cacheable();
    validateOptions(schema, options, 'vue-di-loader');
    
    if(/\.vue$/i.test(this.resourcePath)){
        let ast = new ASTClass(this.resourcePath);
        ast.load(content);
        return ast.javascript;
    }

    else if((/\.ts$/i.test(this.resourcePath))){
        for(let i = 0; i < entries.length; i++){
            let entry = entries[i];
            if(entry === this.resourcePath){
                let ast = new ASTClass(this.resourcePath);
                ast.inject(content);
                return ast.typescript;
            }
        }
    }
    // pass through
    return content;
}
export default load;