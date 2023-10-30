class HtmlStringsAffixer {


    constructor(config = {}, fileContent = "") {
        // Configs
        this.prefix = config.prefix || "{{ __('";
        this.suffix = config.suffix || "') }}";
        this.ignoreChars = config.ignore || ["#", "_", ">", "^", "*", "="];
        this.warningChars = config.warnings || ["%", "{", "(", "}", ")", "$", "'"];
        this.extractions = config.extractions || [
            "text", 
            "placeholder", 
            "alt", 
            "title", 
            "hashtag"
    ];

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
        this.extPrefix = `\\>`
        this.extSuffix = `\\<\\/[A-Za-z0-9]{0,10}\\>`
	    // Generates regex based on prefix, suffix and denied characters
        this.generateRegex()
	    // Parses content and adds strings in foundStrings with specific type
	    this.parseContent("text")
    }

    // opening tag <-> opening tag text extraction
    extractTextOO() {
        this.extPrefix = `(\<[^\/](.{0,10})\>)`;
        this.extSuffix = `(\<[^\/](.{0,10})\>)`;
        this.generateRegex();
        this.parseContent("text");
    }

    // closing tag <-> closing tag text extraction
    extractTextCC() {
        this.extPrefix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.extSuffix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.generateRegex();
        this.parseContent("text");
    }

    // closing tag <-> opening tag text extraction
    extractTextCO() {
        this.extPrefix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.extSuffix = `(\<[^\/](.{0,10})\>)`;
        this.generateRegex();
        this.parseContent("text");
    }

    // HTML input's Placeholders attributes extraction method
    extractPlaceholder() {
        
        this.extPrefix = `placeholder\\s*=\\s*("|')`;
        this.extSuffix = `(\"|')\\s*(\\/|>)`;
        this.generateRegex();
        this.parseContent("placeholder");
    }

    // HTML img's alt attributes extraction method
    extractAlt() {
        this.extPrefix = `alt=(\"|')`;
        this.extSuffix = `(\"|')(\s|/|>)`;
        this.generateRegex();
        this.parseContent("alt");
    }

    // HTML title attributes extraction method
    extractTitle() {
        this.extPrefix = `title=(\"|')`;
        this.extSuffix = `(\"|')(\s|/|>)`;
        this.generateRegex();
        this.parseContent("title");
    }

    // Extracts "#text" type (selected) strings
    // Note: This extraction doesn't uses ignore characters
    extractHashtag() {

        this.extPrefix = `(?<=[">\\s])#`;
        this.extSuffix = `(?=["'<\\/])`;
        this.generateRegex();
        this.parseContent("hashtag");
    }


    generateRegex() {
        if (this.extPrefix && this.extSuffix) {
            let deniedCharString = this.ignoreChars.join("\\");

            // If extracting hashtags, form the regex slightly differently.
            if (this.extPrefix.includes("#")) {
                this.searchRegex = `${this.extPrefix}(.*?)${this.extSuffix}`;
            } else {
                this.searchRegex = `${this.extPrefix}([^${deniedCharString}]+)${this.extSuffix}`;
            }

        }
    }

    parseContent(htmlType) {
        const regexFlags = ["placeholder", "alt", "title"].includes(htmlType) ? "gi" : "g"
        const regex = new RegExp(this.searchRegex, regexFlags);  // Ensure 'g' flag is set for global
        let match;
        
        console.log(this.searchRegex)

        while ((match = regex.exec(this.content)) !== null) {
            let element = match[0]; // full match
            
            // removes (trims) finding prefix and suffix
            let found = this.removeParsePrefix(element);
            found = this.removeParseSuffix(found);
    
            // add as a new string if no duplicates found
            if (!this.checkDuplicate(found, htmlType)) {
                const lines = this.findLineOfString(element);
                this.addNewString(found, element, htmlType, lines.join(", "));
            }
        }
    }

    // Cleanup START
    removeParsePrefix(element) {
        // If extracting hashtags, directly return the element as prefix is just a lookbehind
        if (this.extPrefix.includes("#")) {
            return element;
        }

        // find all occurrences
        const re = new RegExp(this.extPrefix, 'g');
        const foundSlice = element.match(re) || [];

        console.log(re, foundSlice, element);


        // Check if foundSlice is empty
        if (foundSlice.length === 0) {
            return element;
        }

        return this.removeFirstOccurrence(element, foundSlice[0]);
    }

    removeParseSuffix(element) {
        // If extracting hashtags, directly return the element as suffix is just a lookahead
        if (this.extPrefix.includes("#")) {
            return element;
        }

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
        this.content = htmlText
        this.originalContent = htmlText
        if (this.content) {
            if(this.extractions.includes("text")) {
                this.extractText()
                this.extractTextOO()
                this.extractTextCC()
                this.extractTextCO()
            }
            if(this.extractions.includes("placeholder")) {
                this.extractPlaceholder()
            }
            if(this.extractions.includes("alt")) {
                this.extractAlt()
            }
            if(this.extractions.includes("title")) {
                this.extractTitle()
            }
            if(this.extractions.includes("hashtag")) {
                this.extractHashtag()
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