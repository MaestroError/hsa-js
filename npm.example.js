import HtmlStringsAffixer from "hsa-js";

// Example of using HtmlStringsAffixer in a Laravel Blade template
const bladeTemplateContent = `
    <div>
        <h1>Welcome to our website</h1>
        <p>{{stayEnjoyment}}</p>
        <a href="/contact">Contact us</a>
    </div>
`;

const affixer = new HtmlStringsAffixer({
    prefix: "{{ __('", // Prefix to add before string
    suffix: "') }}", // Suffix to add after string
    extractions: [
        "text", // Since we have only texts
    ],
});
const localizedContent = affixer.affixIt(bladeTemplateContent);
console.log(localizedContent);