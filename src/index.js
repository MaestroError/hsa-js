import HtmlStringsAffixer from './htmlStringsAffixer.js';
import fs from 'fs/promises';

const affixer = new HtmlStringsAffixer();

let htmlContent = await fs.readFile('./test.blade.php', 'utf-8')

const resultNew = affixer.affixIt(htmlContent);
