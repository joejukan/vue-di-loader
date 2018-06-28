import { DependencyClass } from '../classification';
import { dependencies } from "../globalization";
import {basename, extname} from "path";
import {DOMParser, XMLSerializer} from "xmldom";
import * as compiler from "vue-template-compiler";
import {ComponentOptions, DirectiveOptions, ComputedOptions, } from "vue";
import {readFileSync as read} from "fs";
import AST, {SourceFile, Node, VariableDeclarationKind} from "ts-simple-ast";
import {transpile, CompilerOptions, ModuleResolutionKind, ModuleKind} from "typescript";
import { kebab, preCompile, functionString } from '../function';
import { Argumenter } from '@joejukan/argumenter';

const RENDER_NAME = "__render__";
const STATIC_RENDER_NAME = "__staticrender__";
const COMPONENTS_NAME = "__components__";
const REGEX_KEY = /\'[\w\-\%\_]+\'(?=\:)|\"[\w\-\%\_]+\"(?=\:)/gm;
const REGEX_BEGIN_QUOTE = /^(?:\"|\')/gm;
const REGEX_END_QUOTE = /(?:\"|\')$/gm;
const REGEX_RENDER = /(?:\'|\")\%\%\%RENDER\%\%\%(?:\'|\")/i;
const REGEX_STATIC_RENDER = /(?:\'|\")\%\%\%STATICRENDER\%\%\%(?:\'|\")/i;
const REGEX_COMPONENTS = /(?:\'|\")\%\%\%COMPONENTS\%\%\%(?:\'|\")/i;


export class ASTClass extends AST{
    public typescript: string;
    public javascript: string;
    public template: string;
    public style: string;
    public sfc: SFCDescriptor;
    public path: string;

    public source: SourceFile;

    public constructor();
    public constructor(path: string);
    public constructor(...args){
        super();
        let argue = new Argumenter(args);
        this.path = argue.string;
    }

    public get name(): string{
        let path = this.path;
        if(path){
            let base = basename(path);
            let ext = extname(path);
            return `${base}.${ext}`;
        }
    }

    private processScript() {
        let source = this.source = this.createSourceFile(this.name);
        source.insertText(0, this.typescript)
        let classes = source.getClasses();
        let template = this.template;

        for(let i = classes.length - 1; i >= 0 ; i--){
            let cls = classes[i];

            // handle decorator
            let decorator = cls.getDecorator(dec => {
                let name = dec.getName();
                let isComp = /Component/i.test(name);

                return isComp;
            });

            
            if(decorator){
                if(!decorator.isDecoratorFactory()){
                    decorator.setIsDecoratorFactory(true);
                }

                let args = decorator.getArguments();
                let arg = (args.length > 0 ? args[0] : undefined);
                if(!arg){
                    decorator.addArgument("{}");
                    arg = decorator.getArguments()[0];
                }

                let options = <ComponentOptions<any>> {};
                eval(`options = ${arg.getText()}`);
                
                if(!options.name){
                    options.name = kebab(cls.getName());
                }

                let renders = compiler.compileToFunctions(preCompile(this.template));

                let statics = renders.staticRenderFns;
                let staticStrings = "[ ";

                for(let j = 0; j < statics.length; j++){
                    let s = statics[j];
                    if(j > 0)
                        staticStrings += ", "
                    staticStrings += `function () { ${functionString(s)} }`;
                }

                staticStrings += " ]";
                let imports = new Array<DependencyClass>();

                
                // imports
                for(var k in dependencies){
                    let dependency = dependencies[k];
                    let name = dependency.name;
                    let symbol = dependency.symbol;

                    if(name != options.name){
                        let dom = new DOMParser();
                        let doc = dom.parseFromString(template, 'text/xml').documentElement;
                        let elements = doc.getElementsByTagName(dependency.name)
                        if(elements.length > 0){
                            imports.push(dependency);
                        }

                    }
                    
                }

                // template variable
                source.insertVariableStatement(0, {
                    declarationKind: VariableDeclarationKind.Const,
                    declarations: [
                        {
                            name: STATIC_RENDER_NAME,
                            type: "Array<Function>",
                            initializer: staticStrings
                        }
                    ]
                })

                source.insertFunction(0, {
                    name: RENDER_NAME,
                    bodyText: functionString(renders.render)
                })

                let componentString = "{\n";
                for(let j = 0; j < imports.length; j++){
                    let imp = imports[j];
                    if(j > 0)
                        componentString += ",\n";

                    componentString += `'${imp.name}': ${imp.symbol}`;
                }

                componentString += "\n}"

                source.insertVariableStatement(0, {
                    declarationKind: VariableDeclarationKind.Const,
                    declarations: [
                        {
                            name: COMPONENTS_NAME,
                            initializer: (imports.length > 0 ? componentString : "{}")
                        }
                    ]
                });

                for(let j = 0; j < imports.length; j++){
                    let imp = imports[j];
                    source.insertImportDeclaration(0, {
                        moduleSpecifier: imp.relative(this.path),
                        namedImports: [{
                            name: imp.symbol
                        }]
                    })
                }
                
                options.render = <any> "%%%RENDER%%%";
                options.staticRenderFns = <any> "%%%STATICRENDER%%%";
                options.components = <any> "%%%COMPONENTS%%%"

                let optionString = JSON.stringify(options);
                optionString = optionString.replace(REGEX_KEY, key => {
                    return key.replace(REGEX_BEGIN_QUOTE, " ").replace(REGEX_END_QUOTE, "");
                })

                optionString = optionString.replace(REGEX_RENDER, ` ${RENDER_NAME} `);
                optionString = optionString.replace(REGEX_STATIC_RENDER, ` ${STATIC_RENDER_NAME} `);
                optionString = optionString.replace(REGEX_COMPONENTS, ` ${COMPONENTS_NAME} `);
                arg.replaceWithText(optionString);
            }
        }
        this.typescript = source.getText();
    }


    public load(content: string){
        let sfc = this.sfc = compiler.parseComponent(content);
        this.typescript = sfc.script.content;
        this.template = `<div>${sfc.template.content}</div>`;
        if(sfc.styles.length > 0){
            this.style = sfc.styles[0].content;
        }

        this.processScript();

        this.javascript = transpile(this.typescript, {
            module: ModuleKind.CommonJS,
            moduleResolution: ModuleResolutionKind.NodeJs,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            allowSyntheticDefaultImports: true,
            noImplicitUseStrict: true
        });
    }

    public pitch(path: string){
        let content: string = read(path,'utf-8');
        content = "<source>" + content + "</source>";
        let source = this.createSourceFile('tmp.ts');
        source.insertText(0, content);

        let classes = source.getClasses();

        for(let i = 0; i < classes.length; i++){
            let cls = classes[i];
            let decorators = cls.getDecorators();

            for(let j = 0; j < decorators.length; j++){
                let decorator = decorators[i];

                if(decorator.getName() === "Component"){
                    let args = decorator.getArguments() || [];
                    let opts: string = (args.length > 0 ? args[0].getText() : "{}");
                    let options = <any> {};
                    eval(`options = ${opts}`);
                    let name = undefined;
                    let symbol = cls.getName();
                    if(options.name){
                        name = options.name;
                    }
                    else{
                        name = kebab(symbol);
                    }

                    dependencies[name] = new DependencyClass(name, symbol, path);
                    return;
                }
            }
        }

    }
}