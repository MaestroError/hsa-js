class HtmlStringsAffixer {
    constructor(config = {}) {
        this.prefix = config.prefix || "{{ __('";
        this.suffix = config.suffix || "') }}";
        this.ignoreChars = config.ignore || ["#", "_", ">", "^", "*", "="];
        this.warningChars = config.warnings || ["%", "{", "(", "}", ")", "$", "'"];
    }

    affix(htmlText) {
        const regex = />([^<]+)</g;
        let matches;
        let warnings = [];
        let result = htmlText;

        while ((matches = regex.exec(htmlText)) !== null) {
            let str = matches[1].trim();

            if (this.shouldIgnore(str)) continue;

            if (this.shouldWarn(str)) {
                warnings.push(`Warning for string: "${str}"`);
                continue;
            }

            const replacement = `>${this.prefix}${str}${this.suffix}<`;
            result = result.replace(`>${str}<`, replacement);
        }

        return { result, warnings };
    }

    shouldIgnore(str) {
        for (let char of this.ignoreChars) {
            if (str.includes(char)) return true;
        }
        return false;
    }

    shouldWarn(str) {
        for (let char of this.warningChars) {
            if (str.includes(char)) return true;
        }
        return false;
    }

    extractText() {
        
    }
}

export default HtmlStringsAffixer;