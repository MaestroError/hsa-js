import HtmlStringsAffixer from './../src/htmlStringsAffixer.js';

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

/*
    If you pass the second arguments of affixIt method as "true", it will report info in console
    Also, it will return 2 values:
        content - Localized (Affixed) content
        report - detailed info about replacement and all warnings 
*/
const { content, report } = affixer.affixIt(bladeTemplateContent, true);

console.log(content);
console.log(report);