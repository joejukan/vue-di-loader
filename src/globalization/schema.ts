var _schema = {
    type: "object",
    properties: {
        esModule: {
            type: "boolean"
        },
        precompile:{
            type: "boolean"
        },
        loaders: {
            type: "object"
        }
    },
    additionalProperties: false
}

export const schema = _schema;