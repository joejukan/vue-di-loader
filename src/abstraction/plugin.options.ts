import Vue from "vue";
export interface PluginOptions  {
    debug: boolean;
    injections: {
        [moduleName: string]: { [componentName: string]: Vue}
    }
} 