declare interface Context extends Function {
    async (): {(err: Error, content: string, sourceMap?: {[key: string]: any}, meta?: {[key: string]: any}): void};
    cacheable (): void;
    callback (err: Error, content: string): void;
    callback (err: Error, content: string, sourceMap: {[key: string]: any}): void;
    callback (err: Error, content: string, sourceMap: {[key: string]: any}, meta: {[key: string]: any}): void;
    emitWarning(warning: Error);
    emitError(error: Error);
    pitch: Function;
    resourcePath: string;
    resourceQuery: string;
    data: {[key: string]: any}
}

declare interface Schema {
    esModule: boolean,
    precompile: boolean;
    loaders: {[key: string]: string}
}