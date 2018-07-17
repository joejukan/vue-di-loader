import { DependencyClass, ASTParser } from '../classification';
import { dependencies, sass, configuration } from "../globalization";
import {basename, extname} from "path";
import {DOMParser} from "xmldom";
import * as compiler from "vue-template-compiler";
import { renderSync } from "node-sass";

import {readFileSync as read} from "fs";
import AST, {SourceFile, VariableDeclarationKind, ImportDeclarationStructure, SyntaxKind, NewExpression, ObjectLiteralExpression, ClassDeclaration, MethodDeclaration, IndentStyle, Scope} from "ts-simple-ast";
import {transpile, ModuleResolutionKind, ModuleKind} from "typescript";
import { preCompile, functionString, log, DependencyType } from '../.';
import { Argumenter } from '@joejukan/argumenter';
import { kebab, uuid } from '@joejukan/web-kit';

const RENDER_NAME = "__render__";
const STATIC_RENDER_NAME = "__staticrender__";
const COMPONENTS_NAME = "__components__";
const REGEX_KEY = /\'[\w\-\%\_]+\'(?=\:)|\"[\w\-\%\_]+\"(?=\:)/gm;
const REGEX_BEGIN_QUOTE = /^(?:\"|\')/gm;
const REGEX_END_QUOTE = /(?:\"|\')$/gm;
const REGEX_RENDER = /(?:\'|\")\%\%\%RENDER\%\%\%(?:\'|\")/i;
const REGEX_STATIC_RENDER = /(?:\'|\")\%\%\%STATICRENDER\%\%\%(?:\'|\")/i;
const REGEX_COMPONENTS = /(?:\'|\")\%\%\%COMPONENTS\%\%\%(?:\'|\")/i;
const REGEX_EXTRACT_STRING = /^\s*[\'\"\`](.*)[\'\"\`]\s*$/;


export class ASTClass extends AST{
    public typescript: string;
    public javascript: string;
    public template: string;
    public style: SFCBlock;
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
    private log(value: any){
        log(`[ast-class] ${value}`);
    }
    private toImportDeclaration(dependency: DependencyClass) {

        let declaration = <ImportDeclarationStructure>{
            moduleSpecifier: dependency.relative(this.path)
        };

        if(dependency.type === DependencyType.VUE){
            if (dependency.defaulted) {
                declaration.defaultImport = dependency.symbol;
            }
            else {
                declaration.namedImports = [{ name: dependency.symbol }];
            }
        }

        return declaration;
    }

    private processScript() {
        let source = this.source = this.createSourceFile(this.name);
        source.insertText(0, this.typescript);
        let parser = new ASTParser(source);
        let classes = source.getClasses();
        let template = this.template;

        for(let i = classes.length - 1; i >= 0 ; i--){
            let cls = classes[i];
            let symbol = cls.getName();
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
                let arg = <ObjectLiteralExpression> (args.length > 0 ? args[0] : decorator.addArgument("{}"));
                let componentName: string;
                let literal = parser.get('name', arg, SyntaxKind.StringLiteral);
                    
                if(literal) {
                    let parts = REGEX_EXTRACT_STRING.exec(literal.getText());
                    if(parts && parts.length > 1){
                        componentName = parts[1];
                    }
                }
                else{
                    componentName = kebab(symbol);
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

                    if(name !== componentName){

                        if(configuration.domParsing){
                            let dom = new DOMParser();
                            let doc = dom.parseFromString(template, 'text/html');
                            if(doc){
                            let elements = doc.getElementsByTagName(dependency.name)
                                if(elements.length > 0){
                                    imports.push(dependency);
                                } 
                            }
                        }
                        else{
                            let regexp = new RegExp(`\\<\\s*${name.replace(/\-/, '\\-')}[\\s\\/\\>]+`, 'mi');
                            if(regexp.test(template)){
                                imports.push(dependency);
                            }
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
                
                
                let componentsDec = source.insertVariableStatement(0, {
                    declarationKind: VariableDeclarationKind.Const,
                    declarations: [
                        {
                            name: COMPONENTS_NAME,
                            initializer: "{}"
                        }
                    ]
                }).getDeclarations()[0];

                let components = componentsDec.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
                imports.forEach(imp => {
                    components.addPropertyAssignment({name: `'${imp.name}'`, initializer: imp.symbol})
                })

                for(let j = 0; j < imports.length; j++){
                    let imp = imports[j];
                    source.insertImportDeclaration(0, this.toImportDeclaration(imp));
                }

                // TODO: check if components already existing
                arg.addPropertyAssignment({name: 'render', initializer: RENDER_NAME});
                arg.addPropertyAssignment({name: 'staticRenderFns', initializer: STATIC_RENDER_NAME});
                arg.addPropertyAssignment({name: 'components', initializer: COMPONENTS_NAME});

                this.mounted(cls);
            }
        }
        try{
            source.organizeImports();
        }
        catch(ex){
        }
        
        this.typescript = source.getText();
    }


    public load(content: string){
        let sfc = this.sfc = compiler.parseComponent(content);
        this.typescript = sfc.script.content;
        this.template = sfc.template.content;
        if(sfc.styles.length > 0){
            let style = sfc.styles[0];
            this.style = (style.content ? style : undefined);
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

        this.log(`loading content from ${this.path}:\n${this.typescript}`)
    }

    public pitch(path: string){
        this.log(`pitching (${path})`);
        let content: string = read(path,'utf-8');
        content = "<source>" + content + "</source>";
        let source = this.createSourceFile(`${uuid()}.ts`);
        source.insertText(0, content);
        let parser = new ASTParser(source);
        let classes = source.getClasses();

        for(let i = 0; i < classes.length; i++){
            let cls = classes[i];
            let symbol = cls.getName();
            let decorators = cls.getDecorators();
            
            for(let j = 0; j < decorators.length; j++){
                let decorator = decorators[j];

                if(decorator.getName() === "Component"){
                    let args = decorator.getArguments();
                    let arg: ObjectLiteralExpression;
                    if(!Array.isArray(args) || args.length === 0){
                        arg = <ObjectLiteralExpression> decorator.addArgument("{}")
                    }
                    else{
                        arg = <ObjectLiteralExpression> args[0];
                    }
                    let name:string = undefined;
                    
                    let literal = parser.get('name', arg, SyntaxKind.StringLiteral);
                    
                    if(literal) {
                        let parts = REGEX_EXTRACT_STRING.exec(literal.getText());
                        if(parts && parts.length > 1){
                            name = parts[1];
                        }
                    }
                    else{
                        name = kebab(symbol);
                    }                    
                    
                    if(name){
                        dependencies[name] = new DependencyClass(name, symbol, path, cls.isDefaultExport());
                        return;
                    }
                }
            }
        }
    }

    public inject(content: string) {
        let source =  this.createSourceFile(`${uuid()}.ts`);
        source.replaceWithText(content);
        
        if (!source)
            return;

        let finder = new ASTParser(source);
        let declaration = finder.findVariableDeclaration('CombinedVueInstance');

        if (!declaration)
            return;

        let lastChild = declaration.getLastChild();
        let expression: NewExpression = declaration.getFirstChildByKind(SyntaxKind.NewExpression);

        if (!expression)
            return;

        let args = expression.getArguments();

        if (!args || args.length != 1)
            return;

        let arg = args[0];
        let object = arg.getFirstChildByKind(SyntaxKind.SyntaxList)
        if (!object)
            return;

        let pairs = object.getChildren();

        if (!pairs)
            return;

        let components: ObjectLiteralExpression;
        
        pairs.forEach(pair => {
            let key = pair.getFirstChildByKind(SyntaxKind.Identifier);
            let kind = pair.getKind();
            if (key && key.getText() === 'components') {
                if(kind === SyntaxKind.ShorthandPropertyAssignment){
                    pair.replaceWithText('components: {...components}');
                }
                else if(kind === SyntaxKind.PropertyAssignment){
                }
                else{
                    pair.replaceWithText('components: {}');
                }
                components = <ObjectLiteralExpression> pair.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
            }
        })

        if(!components){
            if(object.getLastChild().getKind() !== SyntaxKind.CommaToken){
                object.addChildText(',');
            }
            components = <ObjectLiteralExpression> object.addChildText('components: {}')[0].getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
        }

        for(let k in dependencies){
            let dependency = dependencies[k];
            source.addImportDeclaration(this.toImportDeclaration(dependency));
            if(dependency.type === DependencyType.VUE){
                components.addPropertyAssignment({ name: `'${dependency.name}'`, initializer: dependency.symbol})
            }
        }
        
        source.organizeImports();
        this.typescript = source.getText();
        this.log(`after injection in (${this.path}):\n${this.typescript}`);
    }

    public mounted(cls: ClassDeclaration) {
        if(this.style){
            // TODO: add business logic to search for @Mounted and @Updated when decorators are supported in vue-di-kit.
            ['created', 'mounted', 'updated'].forEach( name => {
                let method = cls.getMethod(name);
                if(method){
                    let body = method.getBody();
                    let text = undefined;
                    if(body){
                        let content = body.getLastChildByKind(SyntaxKind.SyntaxList);
                        if(content){
                            text = content.getText();
                        }
                    }
                    this.codeEventMethods(method, text);
                }
                else {
                    method = cls.addMethod({name, scope: Scope.Public});
                    this.codeEventMethods(method);
                }
            })
        }
    }

    private codeEventMethods(method: MethodDeclaration, suffix?: string){
        switch(method.getName()){
            case 'created': this.codeCreateMethod(method, suffix); break;
            case 'mounted':
            case 'updated':
                this.codeMountedUpdatedMethods(method, suffix); break;
        }
    }
    private codeMountedUpdatedMethods(method: MethodDeclaration, suffix?: string){
        if(this.style){
            
            let text = '/* auto generated code for DI styles */\n';
            text += `if(this.$el.nodeType == 1 && !this.$DI.styled && this.$DI.style){\n`;
            text += `this.$el.appendChild( this.$DI.style );\n`;
            text += `}\n`;

            if(suffix){
                text += '\n/* appended code from previous method implementation */\n'
                text += suffix;
            }
            method.setBodyText(text);
            method.formatText({indentStyle: IndentStyle.Smart});
        }
    }

    private codeCreateMethod(method: MethodDeclaration, suffix?: string){
        let text = '/* auto generated code for DI object */\n';
        text += `this.$DI = { style: undefined };\n`;
        if(this.style){
            let id = `_style_di_${Math.floor( 10 + 100000*Math.random())}`;
            let css = renderSync({data: this.style.content, includePaths: sass.path}).css.toString();
            text += `let ${id} = document.createElement( 'style' );\n`;
            text += `${id}.appendChild( document.createTextNode( \`${css.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()}\` ) );\n`;
            text += `${id}.setAttribute('id','${id}');\n`;
            if(this.style.scoped){
                text += `${id}.setAttribute('scoped', '');\n`
            }
            text += `this.$DI.style = ${id};\n`;
            text += `Object.defineProperty(this.$DI, 'styled', { enumerable: true, get: () =>( document.getElementById('${id}') ? true : false) } );\n`;
            
        }
        
        if(suffix){
            text += '\n/* appended code from previous method implementation */\n'
            text += suffix;
        }
        method.setBodyText(text);
        method.formatText({indentStyle: IndentStyle.Smart});
    }
    public addFile(path: string){
        ASTClass.addFile(path);
    }
    public static addFile(path: string){
        // TODO: consider HOT loading
        dependencies[uuid()] = new DependencyClass(basename(path), extname(path), path, DependencyType.FILE);
    }
}