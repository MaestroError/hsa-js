class HtmlStringsAffixer {


    constructor(config = {}, fileContent = "") {
        // Configs
        this.prefix = config.prefix || "{{ __('";
        this.suffix = config.suffix || "') }}";
        this.ignoreChars = config.ignore || ["#", "_", ">", "^", "*", "="];
        this.warningChars = config.warnings || ["%", "{", "(", "}", ")", "$", "'"];
        this.extractions = config.extractions || ["text", "placeholder", "alt", "title", "hashtag"];

        // Properties
        this.content = fileContent || ""
        this.originalContent = fileContent || ""
        this.extPrefix = ""
        this.extSuffix = ""
        this.searchRegex = ""
        this.foundStrings = {data: []}
        this.warnings = []
    }
    

    // Open - Closed
    extractText() {
	    // set affixes for simple strings extraction
        this.extPrefix = `(\<[^\/]([A-Za-z0-9]{0,10})\>)`
        this.extSuffix = `(\<\/([A-Za-z0-9]{0,10})\>)`
	    // Generates regex based on prefix, suffix and denied characters
        this.generateRegex()
	    // Parses content and adds strings in foundStrings with specific type
	    this.parseContent("text")
    }

    generateRegex() {
        if (this.extPrefix && this.extSuffix) {
            let deniedCharString = this.ignoreChars.join("\\")
            let regexp = new RegExp(this.extPrefix + `[^${deniedCharString}]+[A-Za-z0-9][^${deniedCharString}]+` + `[^${deniedCharString}]` + this.extSuffix);
            this.searchRegex = regexp.source; // Gets the pattern string of the regexp
        }
    }

    parseContent(htmlType) {
        // find all strings based on regex
        const submatchall = this.content.match(`(\<\/([A-Za-z0-9]{0,10})\>)`) || [];
        console.log(this.searchRegex)
        
        submatchall.forEach(element => {
            // removes (trims) finding prefix and suffix
            let found = this.removeParsePrefix(element);
            found = this.removeParseSuffix(found);

            // add as a new string if no duplicates found
            if (!this.checkDuplicate(found, htmlType)) {
                const lines = this.findLineOfString(element);
                this.addNewString(found, element, htmlType, lines.join(", "));
            }
        });
    }

    // Cleanup START
    removeParsePrefix(element) {
        // find all occurrences
        const re = new RegExp(this.extPrefix, 'g');
        const foundSlice = element.match(re) || [];

        // Check if foundSlice is empty
        if (foundSlice.length === 0) {
            return element;
        }

        return this.removeFirstOccurrence(element, foundSlice[0]);
    }

    removeParseSuffix(element) {
        // find all occurrences
        const re = new RegExp(this.extSuffix, 'g');
        const foundSlice = element.match(re) || [];

        // Check if foundSlice is empty
        if (foundSlice.length === 0) {
            return element;
        }

        // get the needed part of the string (the last)
        const needToRemove = foundSlice[foundSlice.length - 1];

        return this.removeLastOccurrence(element, needToRemove);
    }

    // Placeholder for the removeFirstOccurrence method
    removeFirstOccurrence(str, occurrence) {
        return str.replace(occurrence, '');
    }

    // Placeholder for the removeLastOccurrence method
    removeLastOccurrence(str, occurrence) {
        const pos = str.lastIndexOf(occurrence);
        if (pos !== -1) {
            return str.slice(0, pos) + str.slice(pos + occurrence.length);
        }
        return str;
    }

    // Cleanup END

    // Helpers START

    checkDuplicate(found, foundType) {
        let result = false;

        if (this.foundStrings.data) {
            for (let fs of this.foundStrings.data) {
                if (fs.found === found && fs.type === foundType) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    addNewString(found, originalString, foundType, lines) {
        const foundObject = {
            found: found,
            originalString: originalString,
            type: foundType,
            lines: lines
        };

        this.foundStrings.data.push(foundObject);
    }

    findLineOfString(str) {
        const lines = this.content.split('\n'); // Splitting content into lines
        const foundOnLines = [];

        // Check each line for the existence of the given string
        lines.forEach((line, index) => {
            if (line.includes(str)) {
                foundOnLines.push(index + 1); // Line numbers start from 1
            }
        });

        return foundOnLines.map(String); // Convert line numbers to strings
    }

    // Helpers END

    affixIt(htmlText) {
        let result = "";
        this.content = htmlText
        this.originalContent = htmlText
        if (this.content) {
            if(this.extractions.includes("text")) {
                this.extractText()
            }
        }

        console.log(this.foundStrings)
        console.log(this.warnings)
        console.log(this.content)

        return this.content;
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
}

export default HtmlStringsAffixer;