import HtmlStringsAffixer from './htmlStringsAffixer.js';
import fs from 'fs/promises';

const affixer = new HtmlStringsAffixer();
const inputHtml = '<p>Some nice string</p><p>Price: $100</p>';

const { result, warnings } = affixer.affix(inputHtml);
console.log(result); // <p>{{ __('Some nice string') }}</p><p>Price: $100</p>
console.log(warnings); // ["Warning for string: "Price: $100"]


let htmlContent = await fs.readFile('./test.blade.php', 'utf-8')

const resultNew = affixer.affixIt(htmlContent);
