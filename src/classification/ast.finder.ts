import { SourceFile, VariableDeclaration } from "ts-simple-ast";
import { Argumenter } from "@joejukan/argumenter";

export class ASTFinder {
    private source: SourceFile;

    public constructor(...args){
        let argue = new Argumenter(args);
        this.source = argue.instance(SourceFile);
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
}