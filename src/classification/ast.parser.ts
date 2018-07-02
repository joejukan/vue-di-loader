import { SourceFile, VariableDeclaration, Node, ObjectLiteralExpression, SyntaxKind, SyntaxList, Identifier } from "ts-simple-ast";
import { Argumenter } from "@joejukan/argumenter";
import { log } from "../function";

export class ASTParser {
    private source: SourceFile;

    public constructor(...args){
        let argue = new Argumenter(args);
        this.source = argue.instance(SourceFile);
    }

    public log(value: any){
        log(`[ast-finder] ${value}`);
    }

    public findVariableDeclaration(type: {new ()}): VariableDeclaration;
    public findVariableDeclaration(name: string): VariableDeclaration;
    public findVariableDeclaration(...args): VariableDeclaration {
        let argue = new Argumenter(args);
        let source = this.source;
        let name = argue.string
        let ctor: {new ()} = argue.function;

        if(ctor && !name){
            name = ctor.name;
        }
        if(source){
            let statements = source.getVariableStatements();
            if(statements){
                for(let i = 0; i < statements.length; i++) {
                    let declarations = statements[i].getDeclarations();
                    if(declarations){
                        for(let j = 0; j < declarations.length; j++){
                            let declaration = declarations[j];
                            let type = declaration.getType();
                            if(type){
                                let symbol = type.getSymbol() || type.getAliasSymbol();
                                if(symbol && symbol.getName() === name){
                                    return declaration;
                                }
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }
    public exists(key: string, node: Node): boolean{
        return typeof this.get(key, node) !== 'undefined';
    }

    public get(key: string, node: Node): ObjectLiteralExpression
    public get(...args): ObjectLiteralExpression{
        let argue = new Argumenter(args);
        let key = argue.string;
        let node:Node = <Node> argue.object;
        let syntax:SyntaxList = undefined;

        switch(node.getKind()){
            case SyntaxKind.SyntaxList: 
                syntax = <any> node;
                break;
            case SyntaxKind.ObjectLiteralExpression: 
                syntax = node.getFirstChildByKind(SyntaxKind.SyntaxList)
                break;
        }

        if(syntax){
            let pairs = syntax.getChildren()
            pairs.forEach(pair => {
                let id = pair.getFirstChildByKind(SyntaxKind.Identifier);
                if(key === id.getText() || `'${key}'` === id.getText() || `"${key}"` === id.getText())
                    return pair.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
            });
        }

        return
    }
}