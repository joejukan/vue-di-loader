declare module "vue-template-compiler" {
    var compiler: Compiler;
    export = compiler;
}

interface Compiler {
    compileToFunctions (template: string): RenderedFunction;
    parseComponent(content: string): SFCDescriptor
}

interface RenderedFunction {
    render: Function;
    staticRenderFns: Array<Function>;
}

interface SFCDescriptor {
    template: SFCBlock;
    script: SFCBlock;
    styles: Array<SFCBlock>;
    customBlocks?: Array<SFCBlock>;
}

interface SFCBlock {
    type: string;
    content: string;
    attrs: {[attribute:string]: string};
    start?: number;
    end?: number;
    lang?: string;
    src?: string;
    scoped?: boolean;
    module?: string | boolean;
}