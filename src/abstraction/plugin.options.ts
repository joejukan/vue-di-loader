import Vue from "vue";
export interface PluginOptions  {
    debug?: boolean;
    externals?: {
        [moduleName: string]: { [componentName: string]: Vue}
    },
    components?: {
        entry?: string | string []
        deep?: boolean;
        path?: string | string []
    },
    loaders?: {
        file?: {
            path: string | string[];
            type: string [];
        },
        sass?: {
            path: string[];
        }
    }
} 