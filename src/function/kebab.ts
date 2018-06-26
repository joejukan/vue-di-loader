import { Argumenter } from "@joejukan/argumenter";

export function kebab (value: string): string;
export function kebab (type: new () => any)
export function kebab (...args): string {
    let argue = new Argumenter(args);
    let string = argue.string;
    let type: new () => any = argue.function;
    
    let value: string = string || type.name;
    return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}