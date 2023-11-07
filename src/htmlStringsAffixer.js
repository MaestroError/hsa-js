import HtmlReplacer from './htmlReplacer.js';
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

        // Replacing Properties
        this.content = fileContent || ""
        this.originalContent = fileContent || ""
        this.extPrefix = ""
        this.extSuffix = ""
        this.searchRegex = ""
        this.foundStrings = {data: []}
        // Reporting Properties
        this.warnings = []
        this.countReplaced = 0
        this.countFound = 0
        this.countNotReplaced = 0
        this.debug = config.debug || false
    }
    

    // Open - Closed
    extractText() {
	    // set affixes for simple strings extraction
        this.extPrefix = `\\>`
        this.extSuffix = `\\<\\/[A-Za-z0-9]{0,10}\\>`
	    // Generates regex based on prefix, suffix and denied characters
        this.generateRegex()
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "text"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // opening tag <-> opening tag text extraction
    extractTextOO() {
        this.extPrefix = `(\\<[^\\/](.{0,10})\\>)`;
        this.extSuffix = `(\\<[^\\/](.{0,10})\\>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "text"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // closing tag <-> closing tag text extraction
    extractTextCC() {
        this.extPrefix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.extSuffix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "text"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // closing tag <-> opening tag text extraction
    extractTextCO() {
        this.extPrefix = `(\\<\\/[A-Za-z0-9]{0,10}\\>)`;
        this.extSuffix = `(\\<[^\\/](.{0,10})\\>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "text"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // HTML input's Placeholders attributes extraction method
    extractPlaceholder() {
        
        this.extPrefix = `placeholder\\s*=\\s*("|')`;
        this.extSuffix = `(\\"|')\\s*(\\/|>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "placeholder"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // HTML img's alt attributes extraction method
    extractAlt() {
        this.extPrefix = `alt=(\\"|')`;
        this.extSuffix = `(\\"|')(\\s|/|>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "alt"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // HTML title attributes extraction method
    extractTitle() {
        this.extPrefix = `title=(\"|')`;
        this.extSuffix = `(\"|')(\s|/|>)`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "title"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
    }

    // Extracts "#text" type (selected) strings
    // Note: This extraction doesn't uses ignore characters
    extractHashtag() {

        this.extPrefix = `(?<=[">\\s])#`;
        this.extSuffix = `(?=["'<\\/])`;
        this.generateRegex();
	    // Parses content, sets regex flags and adds strings in foundStrings with specific type
        let htmlType = "hashtag"
        this.setRegexFlags(htmlType)
	    this.parseContent(htmlType)
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
        this.setRegexFlags(htmlType)
        const regex = new RegExp(this.searchRegex, this.regexFlags);  // Ensure 'g' flag is set for global
        let match;
        
        // console.log(this.searchRegex)

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
        const re = new RegExp(this.extPrefix, this.regexFlags);
        const foundSlice = element.match(re) || [];

        // console.log(re, foundSlice, element);


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
        const re = new RegExp(this.extSuffix, this.regexFlags);
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

    checkWarningCharacters(elem) {
        let foundChars = []
        this.warningChars.forEach((char) => {
            if (elem["found"].includes(char)) {
                foundChars.push(char)
            }
        })
        return foundChars
    }

    setRegexFlags(htmlType) {
        this.regexFlags = ["placeholder", "alt", "title"].includes(htmlType) ? "gi" : "g"
    }

    // Helpers END

    affixIt(htmlText, report = false) {
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

        // Replace and set new content
        let replacer = this.replace();
        this.content = replacer.content

        // Report
        if (report) {
            this.report()
            return replacer
        }

        // console.log(this.foundStrings)
        // console.log(this.warnings)
        // console.log(this.content)

        // Reset warnings
        this.warnings = []
        // Return new content
        return this.content;
    }

    replace() {
        
        // replace
        let count = 0
        let countEmptyOrNotReplaced = 0
        let replacer = new HtmlReplacer(this.prefix, this.suffix, this.content, this.debug);
        // Loop over found strings
        this.foundStrings.data.forEach((element) => {
            let approved = true
            let replaced;

            // Check "placeholder" placeholder
            if (element["found"].toLowerCase() == "placeholder") {
                let msg = "warning: 'placeholder' in placeholder attribute not allowed -> " + element["found"] + " on line: " + element["lines"]
                this.warnings.push(msg);
                approved = false
            }

            // check warning characters and exclude from replacement
            let foundWarningChars = this.checkWarningCharacters(element)

            if (foundWarningChars.length > 0) {
                this.warnings.push("Warning! Found " + foundWarningChars.toString() + " characters: " + element["found"] + " on line: " + element["lines"]);
                approved = false
            }
            
            if (approved) {
                replaced = replacer.replace(element);
                if (replaced) {
                    count++
                } else {
                    countEmptyOrNotReplaced++
                }
            }
        })
        // counts for report
        this.countReplaced = count
        this.countFound = this.foundStrings.data.length
        this.countNotReplaced = countEmptyOrNotReplaced

        // return replaced content
        // console.log(replacer.getContent());
        // console.log(this.warnings);
        return { content: replacer.getContent(), report: this.reportData()}
    }

    report() {
        // Report finding
        if (this.countFound) {
            console.log("Found strings amount: " + this.countFound);
            if (this.debug) {
                console.log(this.foundStrings)
            }
        }
        // Report replacement
        if (this.countReplaced) {
            console.log("Replaced strings amount: " + this.countReplaced);
        }
        // Report empty
        if (this.countNotReplaced) {
            console.log("Skipped (not replaced and/or empty) strings amount: " + this.countNotReplaced);
        }
        // Report warnings
        if (this.warnings.length) {
            console.log("Strings with warning characters: " + this.warnings.length);
            this.warnings.forEach((element, index) => {
                console.warn(index+1 + ". " + element)
            });
        } else {
            console.log("No warning characters found!");
        }
        // Reset warnings
        this.warnings = []
    }

    reportData() {
        return {
            found: this.countFound,
            replaced: this.countReplaced,
            skipped: this.countNotReplaced,
            warnings_amount: this.warnings.length,
            warnings: this.warnings
        }
    }

    shouldWarn(str) {
        for (let char of this.warningChars) {
            if (str.includes(char)) return true;
        }
        return false;
    }
}

export default HtmlStringsAffixer;