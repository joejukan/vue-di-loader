import { Plugin, Compiler, compilation, Entry, EntryFunc } from "webpack";
import {resolve, sep} from "path";
import {statSync, readdirSync} from "fs";
import { Argumenter } from "@joejukan/argumenter";
import { access, kebab } from "@joejukan/web-kit";
import { PluginOptions } from "../abstraction";
import { configuration, dependencies } from "../globalization";
import { DependencyClass, ASTClass } from ".";
import { log } from "../function";

import Compilation = compilation.Compilation;
import Chunk = compilation.Chunk


export class VueDIPlugin implements Plugin {
    private options: PluginOptions;
    public constructor(options: PluginOptions )
    public constructor(...args){
        let argue = new Argumenter(args);
        this.options = <any> argue.object;
        if(typeof access(this, 'options.debug') === 'boolean'){
            configuration.verbose = this.options.debug;
        }

        if(typeof access(this, 'options.components.deep') === 'boolean'){
            configuration.deep = this.options.components.deep;
        }
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
                entries.forEach(entry => configuration.entries.push(resolve(entry)));
            }
            else if(typeof entries === 'string'){
                configuration.entries.push(resolve(entries));
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

        if(stats.isDirectory()){
            let files = readdirSync(path);

            if(configuration.deep){
                files.forEach(file => this.pitch(`${path}${sep}${file}`));
            }

            else{
                files.forEach(file => {
                    let filePath = `${path}${sep}${file}`;
                    let fileStats = statSync(filePath);
                    if(fileStats.isFile()){
                        this.pitch(filePath)
                    }
                });
            }
            
        }
        else if(stats.isFile()){
            if(/\.vue$/i.test(path)){

                /* set pitched boolean */
                if(!configuration.pitched){
                    configuration.pitched = true;
                }

                let ast = new ASTClass();
                ast.pitch(path);
            }
        }
    }

    public entry(path: string){
        path = resolve(path);
    }

    public log(value: any){
        log(`[vue-di-plugin] ${value}`);
    }
}