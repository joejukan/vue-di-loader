export function preCompile(template: string): string{
    let start = /\s*\<\s*template\s*\>/gmi;
    let end = /\<\s*\/\s*template\s*\>\s*/gmi

    return template.replace(start, "<div>").replace(end, "</div>")
}