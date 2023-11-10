// Use import from "hsa-js"
// import HtmlStringsAffixer from "hsa-js";
import HtmlStringsAffixer from './../src/htmlStringsAffixer.js';

// Example of using HtmlStringsAffixer for a Vue.js template
const vueTemplateContent = `
    <template>
        <div>
            <h1>Welcome to our website</h1>
            <p>{{ stayEnjoyment }}</p>
            <button @click="contactUs">Contact us</button>
        </div>
    </template>
`;

const affixer = new HtmlStringsAffixer({
    prefix: "{{ $t('", // Prefix to add before string
    suffix: "') }}", // Suffix to add after string
    extractions: ["text"], // Since we have only texts
});

const localizedVueContent = affixer.affixIt(vueTemplateContent);
console.log(localizedVueContent);
