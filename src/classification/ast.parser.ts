import { SourceFile, VariableDeclaration, Node, ObjectLiteralExpression, 
    SyntaxKind, SyntaxList, Identifier, MemberExpression, StringLiteral } from "ts-simple-ast";
import { Argumenter } from "@joejukan/argumenter";
import { log } from "../function";
import { ok } from "@joejukan/web-kit";

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

    public exists(key: string, node: Node)
    public exists(...args): boolean{
        let argue = new Argumenter(args);
        let key = argue.string;
        let kind: SyntaxKind = argue.number;
        let node:Node = <Node> argue.object;

        return typeof this.get(node, key, <any> kind) !== 'undefined';
    }

    public get(node: Node, key: string): MemberExpression;
    public get(key: string, node: Node): MemberExpression;
    public get(node: Node, key: string, kind: SyntaxKind.StringLiteral): StringLiteral;
    public get(key: string, node: Node, kind: SyntaxKind.StringLiteral): StringLiteral;
    public get(node: Node, key: string, kind: SyntaxKind.ObjectLiteralExpression): ObjectLiteralExpression;
    public get(key: string, node: Node, kind: SyntaxKind.ObjectLiteralExpression): ObjectLiteralExpression;
    public get(...args): MemberExpression {
        let argue = new Argumenter(args);
        let key = argue.string;
        let kind: SyntaxKind = argue.number;
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
            let pairs = syntax.getChildren() || [];
            for(let i = 0; i < pairs.length; i++){
                let pair = pairs[0];
                let id = pair.getFirstChildByKind(SyntaxKind.Identifier);
                let literal = <MemberExpression> ( ok(kind) ? pair.getFirstChildByKind(kind) : pair.getLastChild());
                
                if(key === id.getText() || `'${key}'` === id.getText() || `"${key}"` === id.getText()){
                    return literal;
                }
                    
            }
        }

        return
    }
}