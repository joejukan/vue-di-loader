import { Plugin, Compiler } from "webpack";
import { Argumenter } from "@joejukan/argumenter";
import { access, kebab } from "@joejukan/web-kit";
import { PluginOptions, dependencies, DependencyClass } from "../.";

export class VueDIPlugin implements Plugin {
    private options: PluginOptions;
    public constructor(options: PluginOptions )
    public constructor(...args){
        let argue = new Argumenter(args);
        this.options = <any> argue.object;
    }
    public apply(compiler: Compiler){
        compiler.plugin('beforeCompile', () => {
            this.log('beforeCompile');
            if(access(this, 'options.injections')){
                let injections = this.options.injections;

                for(let path in injections ){
                    let components = injections[path];
                    for(let symbol in components){
                        let name = kebab(symbol);
                        this.log(`injecting component [ name: ${name}, symbol: ${symbol}, module: ${path} ]`);
                        dependencies[name] = new DependencyClass(name, symbol, path, true);
                    }
                }
            }
        });
    }

    private log(value: string){
        if(access(this, 'options.debug')){
            console.log(`[vue-di-plugin]: ${value}`);
        }
    }
}