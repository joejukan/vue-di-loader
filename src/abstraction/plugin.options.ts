import Vue from "vue";
export interface PluginOptions  {
    components?: {
        entry?: string | string []
        deep?: boolean;
        path?: string | string [],
        hot?: boolean
    };
    debug?: boolean;
    externals?: {
        [moduleName: string]: { [componentName: string]: Vue}
    };
    loaders?: {
        file?: {
            path: string | string[];
            type: string [];
        };
        sass?: {
            path: string[];
        };
    };
    parsers?:{
        dom?: boolean;
    }
} 