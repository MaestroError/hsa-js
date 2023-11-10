// Use import from "hsa-js"
// import HtmlStringsAffixer from "hsa-js";
import HtmlStringsAffixer from './../src/htmlStringsAffixer.js';

// Example of using HtmlStringsAffixer in an Angular template
const angularTemplateContent = `
    <div>
        <h1>Welcome to our website</h1>
        <p>{{ stayEnjoyment }}</p>
        <a (click)="contactUs()">Contact us</a>
    </div>
`;

const affixer = new HtmlStringsAffixer({
    prefix: "{{ '", // Prefix to add before string
    suffix: "' | translate }}", // Suffix to add after string
    ignore: ["#", "_", ">", "^", "*", "=", "(", ")"], // Added parentheses and "@" for Angular event bindings
    warnings: ["%", "{", "}", "$", "'"], // Removed parentheses from warning characters
    extractions: ["text"], // Since we have only texts
});

const localizedAngularContent = affixer.affixIt(angularTemplateContent);
console.log(localizedAngularContent);
