import HtmlStringsAffixer from './htmlStringsAffixer.js';
import fs from 'fs/promises';

describe('HtmlStringsAffixer', () => {
    let htmlContent;
    let resultHtmlContent;

    const textOC = { string: "<p>Testing string</p>", result: "<p>{{ __('Testing string') }}</p>"}
    const textOO = { string: "<div>OT-OT<span>", result: "<div>{{ __('OT-OT') }}<span>"}
    const textCC = { string: "</p>CT-CT</div>", result: "</p>{{ __('CT-CT') }}</div>"}
    const textCO = { string: "</span>CT-OT<p>", result: "</span>{{ __('CT-OT') }}<p>"}
    const placeholderExt = { string: "<input Placeholder='Some text 2' />", result: "<input Placeholder='{{ __('Some text 2') }}' />"}
    const altExt = { string: '<img alt="Alt text for image" />', result: `<img alt="{{ __('Alt text for image') }}" />`}
    const titleExt = { string: `<p title='John "ShotGun" Nelson'>John with double quotes</p>`, result: `<p title='{{ __('John "ShotGun" Nelson') }}'>{{ __('John with double quotes') }}</p>`}
    const hashtagExt = { string: "<p>#John but no quotes</p>", result: "<p>{{ __('John but no quotes') }}</p>"}

    beforeAll(async () => {
        // htmlContent = await fs.readFile('./test.blade.php', 'utf-8');
        // resultHtmlContent = await fs.readFile('./test.result.blade.php', 'utf-8');
    });

    test('It affixs texts correctly', () => {
        let result
        const affixer = new HtmlStringsAffixer();

        // open tag - close tag extraction
        result = affixer.affixIt(textOC.string);
        expect(result).toContain(textOC.result);

        // open tag - open tag extraction
        result = affixer.affixIt(textOO.string);
        expect(result).toContain(textOO.result);

        // close tag - close tag extraction
        result = affixer.affixIt(textCC.string);
        expect(result).toContain(textCC.result);

        // close tag - open tag extraction
        result = affixer.affixIt(textCO.string);
        expect(result).toContain(textCO.result);
    });

    test('It affixs "placeholder" HTML attribute correctly', () => {
        let result
        const affixer = new HtmlStringsAffixer();
        result = affixer.affixIt(placeholderExt.string);
        expect(result).toContain(placeholderExt.result);
    });

    test('It affixs "alt" HTML attribute correctly', () => {
        let result
        const affixer = new HtmlStringsAffixer();
        result = affixer.affixIt(altExt.string);
        expect(result).toContain(altExt.result);
    });

    test('It affixs "title" HTML attribute correctly', () => {
        let result
        const affixer = new HtmlStringsAffixer();
        result = affixer.affixIt(titleExt.string);
        expect(result).toContain(titleExt.result);
    });

    test('It affixs hashtag strings correctly', () => {
        let result
        const affixer = new HtmlStringsAffixer();
        result = affixer.affixIt(hashtagExt.string);
        expect(result).toContain(hashtagExt.result);
    });

});
