import HtmlStringsAffixer from './src/htmlStringsAffixer.js';
import fs from 'fs/promises';

const affixer = new HtmlStringsAffixer();

let htmlContent = await fs.readFile('./test.blade.php', 'utf-8')

const result = affixer.affixIt(htmlContent);

const { content, report } = affixer.affixIt(htmlContent, true);

// console.log(content);
// console.log(content);
// console.log(report);