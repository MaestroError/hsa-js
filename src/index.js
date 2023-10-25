import HtmlStringsAffixer from './htmlStringsAffixer.js';

const affixer = new HtmlStringsAffixer();
const inputHtml = '<p>Some nice string</p><p>Price: $100</p>';

const { result, warnings } = affixer.affix(inputHtml);
console.log(result); // <p>{{ __('Some nice string') }}</p><p>Price: $100</p>
console.log(warnings); // ["Warning for string: "Price: $100"]
