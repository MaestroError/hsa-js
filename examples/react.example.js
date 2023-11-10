// Use import from "hsa-js"
// import HtmlStringsAffixer from "hsa-js";
import HtmlStringsAffixer from './../src/htmlStringsAffixer.js';

// Example of using HtmlStringsAffixer for a React component
const reactComponentContent = `
    <div>
        <h1>Welcome to our website</h1>
        <p>{stayEnjoyment}</p>
        <button onClick={contactUs}>Contact us</button>
    </div>
`;

const affixer = new HtmlStringsAffixer({
    prefix: "{t('", // Prefix to add before string
    suffix: "')}", // Suffix to add after string
    ignore: ["#", "_", ">", "^", "*", "=", "{", "}"], // Added braces to ignore list for React's JSX expressions
    warnings: ["%", "(", ")", "$", "'", "@"], // Removed braces from warning characters
    extractions: ["text"], // Since we have only texts
});

const localizedReactContent = affixer.affixIt(reactComponentContent);
console.log(localizedReactContent);
