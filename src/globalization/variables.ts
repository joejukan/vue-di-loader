import { DependencyClass} from "../classification";
export let dependencies: {[key: string]: DependencyClass} = {};
export let configuration: { 
    pitched?: boolean, 
    verbose?: boolean,
    deep?: boolean, 
    entries?: string[]} = {
    pitched: false,
    verbose: false,
    deep: true,
    entries: new Array<string>()
};

export let sass: { path: string[] } = { path: [] }