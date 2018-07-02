import { ASTClass } from "../src";
import { resolve } from "path";
import { readFileSync } from "fs";
describe(`webpack plugin tests`, () => {
    it(`inject components`, () => {
        let path = resolve('spec/resources/entry-with-components.ts');
        let ast = new ASTClass(path);
        ast.pitch(resolve("spec/resources/app.vue"));
        ast.pitch(resolve("spec/resources/table.vue"));

        ast.inject(readFileSync(path, 'utf-8'));
    })
})