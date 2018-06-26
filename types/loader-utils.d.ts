declare module "loader-utils" {
    export function getOptions(context: Function): Schema;
    export function interpolateName(context: Function, name: string, options: any): any;
    export function parseQuery(query: string): any;
    export function stringifyRequest(object: any): string;
    export function urlToRequest(url: string): string;
}