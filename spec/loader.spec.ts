import {ASTClass, dependencies} from "../src";
import {Unit} from "./helpers";
import {} from "ts-simple-ast";
let app = new Unit("spec/resources/app.vue");
let table = new Unit("spec/resources/table.vue");

app.pitch();
table.pitch();
app.load();
table.load();

describe(`webpack loader tests`, () => {
    it(`test dependencies`, () => {
        ['app', 'table-component'].forEach( name => { 
            expect(dependencies[name]).toBeDefined(`could not find the ${ /component/i.test(name) ? name : name + ' component' } in the dependencies`)
        });
    });

    it(`test imports`, () => {
        let imports = app.source.getImportDeclarations();
        
        expect(imports).toBeDefined(`there were no imported components found in the app source file`);
        expect(imports.length).toBeGreaterThan(0, `there were no imported components found in the app source file`);

        let foundTableImport = false;

        imports.forEach( i => {
            let specifier = i.getModuleSpecifier();
            if(/^\"\.\/table\.vue\"$/i.test(specifier.getText())){
                let names = i.getNamedImports();
                names.forEach(name => {
                    if(/^TableComponent$/i.test(name.getText())){
                        foundTableImport = true;
                        return;
                    }
                });
            }
        });

        expect(foundTableImport).toBeTruthy(`the table component was not imported into the app`);
    });
})