import HtmlStringsAffixer from './htmlStringsAffixer.js';
import fs from 'fs/promises';

describe('HtmlStringsAffixer', () => {
    let htmlContent;
    let resultHtmlContent;

    beforeAll(async () => {
        htmlContent = await fs.readFile('./test.blade.php', 'utf-8');
        resultHtmlContent = await fs.readFile('./test.result.blade.php', 'utf-8');
    });

    test('It should affix strings correctly', () => {
        const affixer = new HtmlStringsAffixer();
        const { result, warnings } = affixer.affix(htmlContent);
        
        // Add your assertions here...
        expect(result).toContain(resultHtmlContent);
    });

    // ... add more tests as needed ...
});
