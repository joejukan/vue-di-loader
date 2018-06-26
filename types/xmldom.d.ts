declare module "xmldom"{
    export class DOMParser{
        parseFromString(xml: string, mime: string): Document;
    }

    export class XMLSerializer{
        serializeToString(node: Node): string;
    }
}