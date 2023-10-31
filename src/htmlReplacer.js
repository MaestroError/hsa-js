class HtmlReplacer {
    constructor(prefix, suffix, content, debug = false) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.content = content;
        this.debug = debug;
    }

    replace(element) {
        let str = element["originalString"];
        let originalString = element["originalString"];
        let found = element["found"].trim();

        if (element["type"] === "hashtag") {
            // Using the replace method to remove only the first occurrence of the "#" character
            str = str.replace("#", "");
        }

        let startIndex = str.indexOf(found);
        if (startIndex > -1) {
            str = str.substring(0, startIndex) + this.prefix + str.substring(startIndex);
            let endIndex = str.indexOf(found) + found.length;
            str = str.substring(0, endIndex) + this.suffix + str.substring(endIndex);

            this.content = this.content.split(originalString).join(str);

            if (this.debug) {
                console.log("Replaced: ", element);
            }

            return true;
        }

        if (this.debug) {
            console.log("Not replaced: ", element);
        }

        return false;
    }

    getContent() {
        return this.content
    }
}

export default HtmlReplacer;
