import { Plugin, Compiler, compilation, Entry, EntryFunc } from "webpack";
import {resolve, sep} from "path";
import {statSync, readdirSync} from "fs";
import { Argumenter } from "@joejukan/argumenter";
import { access, kebab } from "@joejukan/web-kit";
import { PluginOptions, dependencies, DependencyClass, ASTClass } from "../.";

import Compilation = compilation.Compilation;
import Chunk = compilation.Chunk

export class VueDIPlugin implements Plugin {
    public static pitched: boolean = false;
    public static entries: string[] = [];
    private options: PluginOptions;
    public constructor(options: PluginOptions )
    public constructor(...args){
        let argue = new Argumenter(args);
        let options: PluginOptions = this.options = <any> argue.object;
    }
    public apply(compiler: Compiler){
        compiler.hooks.beforeCompile.tap('VueDIPlugin', (compilation) => {
            this.log('beforeCompile');
            // inject external pre-compiled components.
            if(access(this, 'options.externals')){
                this.external();
            }

            if(access(this, 'options.components.path')){
                let path = this.options.components.path;
                if(Array.isArray(path)){
                    path.forEach(p => this.pitch(p))
                }
                else if (typeof path === 'string'){
                    this.pitch(path);
                }
            }

            let entries: string | string[] | Entry | EntryFunc = new Array<string>();

            if(access(this, 'options.components.entry')){
                entries = this.options.components.entry;
                
            }
            if(access(compiler, 'options.entry')){
                entries = compiler.options.entry;
            }

            // TODO: support Entry and EntryFunc
            if(Array.isArray(entries)){
                entries.forEach(entry => VueDIPlugin.entries.push(resolve(entry)));
            }
            else if(typeof entries === 'string'){
                VueDIPlugin.entries.push(resolve(entries));
            }
            for(let k in dependencies){
                this.log(`identified dependency: ${k}`)
            }
        });
    }

    public external() {
        let externals = this.options.externals;

        for (let path in externals) {
            let components = externals[path];
            for (let symbol in components) {
                let name = kebab(symbol);
                this.log(`injecting component [ name: ${name}, symbol: ${symbol}, module: ${path} ]`);
                dependencies[name] = new DependencyClass(name, symbol, path, true);
            }
        }
    }

    public pitch(path: string){
        path = resolve(path);
        let stats = statSync(path);
        this.log(`pitching path: ${path}`);

        if(stats.isDirectory()){
            let files = readdirSync(path);
            files.forEach(file => this.pitch(`${path}${sep}${file}`));
        }
        else if(stats.isFile()){
            if(/\.vue$/i.test(path)){

                /* set pitched boolean */
                if(!VueDIPlugin.pitched){
                    VueDIPlugin.pitched = true;
                }

                let ast = new ASTClass();
                ast.pitch(path);
            }
        }
    }

    public entry(path: string){
        path = resolve(path);
    }

    public log(value: string){
        if(access(this, 'options.debug')){
            console.log(`[vue-di-plugin] ${value}`);
        }
    }
}