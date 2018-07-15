import {posix} from "path";
import {normalize} from "upath";
import { Argumenter } from "@joejukan/argumenter";
import { DependencyType } from "../enumeration";

const REGEX_VUE = /\.vue$/i;
export class DependencyClass {
    public name: string;
    public path: string;
    public symbol: string;
    public defaulted: boolean;
    public type: DependencyType;

    public constructor();
    public constructor(name: string);
    public constructor(name: string, defaulted: boolean);
    public constructor(name: string, symbol: string);
    public constructor(name: string, symbol: string, defaulted: boolean);
    public constructor(name: string, symbol: string, path: string);
    public constructor(name: string, symbol: string, path: string, type: DependencyType);
    public constructor(name: string, symbol: string, path: string, defaulted: boolean);
    public constructor(...args){
        let argue = new Argumenter(args);
        this.name = argue.string;
        this.symbol = argue.string;
        this.path = argue.string;
        this.type = argue.number || DependencyType.VUE;
        this.defaulted = argue.boolean || false;
    }

    public relative(path: string): string {
        let from = posix.dirname(normalize(path));
        let to = normalize(this.path);
        let p = posix.relative(from, to);

        // TODO: evaluate if module
        if(p.match(REGEX_VUE) && !p.match(/^\.+\//)){
            p = `./${p}`;
        }

        return p;
    }
}