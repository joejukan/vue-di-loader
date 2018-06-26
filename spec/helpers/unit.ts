import {resolve} from "path";
import * as fs from "fs";
import {SourceFile} from "ts-simple-ast";
import { ASTClass } from "../../src";

export class Unit {
    private ast: ASTClass;
    public path: string;
    public data: string;

    public constructor(path: string){
        this.path = resolve(path);
        this.data = fs.readFileSync(this.path, "utf-8");
        this.ast = new ASTClass(this.path);
    }

    public get typescript(): string{
        if(this.ast){
            return this.ast.typescript;
        }
    }

    public get javascript(): string{
        if(this.ast){
            return this.ast.javascript;
        }
    }

    public get template(): string{
        if(this.ast){
            return this.ast.template;
        }
    }
    
    public get style(): string{
        if(this.ast){
            return this.ast.style;
        }
    }

    public get source(): SourceFile{
        if(this.ast){
            return this.ast.source;
        }
    }

    public pitch(){
        this.ast.pitch(this.path);
    }
    public load(){
        this.ast.load(this.data);
    }
}