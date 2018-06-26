import { Argumenter } from "@joejukan/argumenter";

export function functionString(method: string): string;
export function functionString(method: Function): string;
export function functionString(...args): string{
    let argue = new Argumenter(args);
    let string: string = argue.string
    let method: Function = argue.function;

    if(string){
        return textString(string);
    }

    if(method){
        return methodString(method);
    }
    return "";
}

function methodString(method: Function): string{
    return textString(method.toString())
}

function textString(value: string): string{
    let start = /^\s*function\s+anonymous\s*\(\s*\)\s*\{\s*/i;
    let end = /\}\s*$/i;
    value = value.replace(start, "").replace(end, "");
    return value;
}