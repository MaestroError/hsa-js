import HtmlStringsAffixer from '../src/htmlStringsAffixer.js';

// Example of using HtmlStringsAffixer in a Laravel Blade template
const bladeTemplateContent = `
    <div>
        <h1>Text type extraction</h1>
        <input placeholder="html attribute" />
        <img alt="html attribute" src="photo.jpg" />
        <p title='html attribute'>Username</p>
        <p>#Hashtag extraction</p>
    </div>
`;

// The configurations set as default
const affixer = new HtmlStringsAffixer({
    prefix: "{{ __('", // Prefix to add before string
    suffix: "') }}", // Suffix to add after string
     // If one of these characters included in string, it will not be catched at all 
    ignore: ["#", "_", ">", "^", "*", "="],
    // If on of these characters included in string, it will not replace but add in warning to manual checking
    warnings: ["%", "{", "(", "}", ")", "$", "'"], 
    // All extraction types: regular html texts; placeholder, alt and title attribute values; Strings marked with "#" character in begining
    extractions: [
        "text", 
        "placeholder", 
        "alt", 
        "title", 
        "hashtag"
    ],
});
const localizedContent = affixer.affixIt(bladeTemplateContent);
console.log(localizedContent);