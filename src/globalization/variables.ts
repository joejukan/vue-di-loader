import { Configuration } from "../abstraction";
import { DependencyClass} from "../classification";

export let dependencies: {[key: string]: DependencyClass} = {};
export let configuration: Configuration = {
    applied: false,
    deep: true,
    domParsing: false,
    entries: new Array<string>(),
    pitched: false,
    verbose: false,
    hot: false
};

export let sass: { path: string[] } = { path: new Array<string>() }