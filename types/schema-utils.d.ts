declare module "schema-utils" {
    function validateOptions(schema: object, options: object, loader: string);
    export = validateOptions;
}