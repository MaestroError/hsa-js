# The html-strings-affixer for Javascript

### Or just hsa.js

hsa-js is a dynamic JavaScript utility designed to streamline the localization process of HTML-based templates and web content. It automates the task of identifying and affixing localization tokens around text strings within HTML, making the process of preparing web pages for translation both efficient and error-free.

### Navigation

- [The first HSA](#the-first-hsa)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contribution](#contributing-to-hsa-js)

### Main Features

- **Automated Text Extraction**: Automatically identifies (visible) text strings within HTML content that require localization.
- **Flexible Configuration**: Offers a customizable configuration to adapt to different localization syntaxes, making it compatible with a variety of frameworks and technologies.
- **Support for Multiple HTML Attributes**: Capable of processing not just text content but also placeholder, alt text, titles, and more, ensuring comprehensive coverage of all translatable elements.
- **Warning and Error Handling**: Generates warnings for potentially problematic characters or patterns, aiding in the prevention of localization errors.
- **Framework Compatibility**: While pre-configured for Laravel Blade syntax, it's adaptable for use with Vue, React, Angular, and other frameworks, making it versatile for different development environments.
- **Debugging Support**: Includes debugging options to help track down and resolve issues during the affixing process.

### Intended Use Cases

HtmlStringsAffixer is intended for developers and localization teams working on multi-lingual web applications and websites. It's particularly useful in scenarios where:

- Preparing HTML templates for translation into multiple languages.
- Automating the localization process in a development workflow.
- Ensuring consistency and accuracy in the localization of HTML content.

Actually, it makes any `<p>Some nice string</p>` in your text to become `<p>{{ __('Some nice string') }}</p>` (Blade example) and etc.

### Problem Solving and Benefits

Localization can be a time-consuming and error-prone process, especially when dealing with complex HTML structures. HtmlStringsAffixer addresses this challenge by:

- **Reducing Manual Effort**: Minimizes the need for manual insertion of localization tokens, speeding up the preparation process.
- **Enhancing Accuracy**: Reduces human errors in the localization process, ensuring that all necessary strings are correctly marked for translation.
- **Improving Efficiency**: Streamlines workflows in development teams, allowing for quicker turnaround times for multi-lingual projects.
- **Increasing Flexibility**: Adapts to various frameworks and technologies, making it a versatile tool in a developer's toolkit.

In essence, HtmlStringsAffixer empowers developers and content creators to focus more on quality development and content creation, while it handles the intricacies of preparing HTML content for localization.

## The first HSA

The original HSA ([MaestroError/html-strings-affixer](https://github.com/MaestroError/html-strings-affixer)), developed by me (MaestroError) and written in Golang, functioned primarily as a Command Line Interface (CLI) tool. Tailored for Laravel projects, it could be installed via Composer and is designed to automate the localization process within Laravel's ecosystem. This version of HSA had a specific operational approach:

1.  **Folder and File Scanning**: The Go-based HSA would scan specified folders (For example `resources/views`), automatically identifying and reading files within.
2.  **In-Place Content Replacement**: It performed replacements directly in the files, updating their content to include localization tokens as necessary.

In contrast, the new `hsa.js` is a more versatile tool, designed for Node.js and web environments. It deviates from its predecessor in several key aspects:

- **Operates Primarily on Strings**: Unlike the Go version, `hsa.js` is built to work with strings rather than directly with files. This means it doesn't automatically scan and modify files but rather processes given string content.
- **Enhanced Versatility and Flexibility**: By focusing on string manipulation, `hsa.js` is adaptable to various environments and workflows, including but not limited to Laravel. It can be integrated into different stages of web development and content management processes, offering broader utility in diverse development contexts.
- **User-Controlled Input**: The responsibility of providing content for localization shifts to the user, allowing for more controlled and specific use cases. This shift makes `hsa.js` a tool better suited for scenarios where direct file manipulation isn't desired or necessary.

## Installation

@todo
Via NPM:

Via CDN:

## Configuration

HtmlStringsAffixer provides several configuration options, allowing for tailored usage according to specific requirements. Here's a detailed explanation of each configuration option:

1.  **prefix**: This is a string that will be prepended to each extracted string. The prefix is an essential part of the localization process, as it defines how the translated string will be identified in your code. For instance, in a Laravel Blade template, this might be `{{ __('`, indicating the start of a translation function call.

2.  **suffix**: Complementing the prefix, this string is appended to each extracted string. Continuing the Laravel Blade example, the suffix would be `') }}`, closing the translation function call. The suffix, like the prefix, is crucial for correctly formatting the localized string in the code.

3.  **ignoreChars**: This option allows you to specify a set of characters that the HtmlStringsAffixer should ignore during the extraction process. These characters are typically ones that might interfere with the correct identification of strings to be localized. Common examples include symbols used in HTML or other markup languages, like `"#"` or `"_"`.

4.  **warningChars**: These are characters that, when found in the extracted strings, will trigger warnings. This feature is particularly useful for identifying potential issues in your strings that might cause problems in the localization process. For instance, special characters like `"%"` or curly braces `"{"` and `"}"` might be part of non-translatable strings like math expressions. Provided warnings helps to manually check the strings.

5.  **extractions**: This configuration defines the types of extractions (And relevant replacement) that HtmlStringsAffixer will perform. It's an array that can include different extraction types, such as:

    - `"text"`: Extracts plain text from HTML or other templates.
    - `"placeholder"`: Specifically targets placeholder attributes in input elements.
    - `"alt"`: Extracts the alt text from image tags.
    - `"title"`: Targets the title attributes in HTML tags.
    - `"hashtag"`: Extracts strings that are marked with a hashtag, which is often used for specific labeling or marking of elements.

```javascript
// The configurations set as default
const affixer = new HtmlStringsAffixer({
  prefix: "{{ __('", // Prefix to add before string
  suffix: "') }}", // Suffix to add after string
  // If one of these characters included in string, it will not be catched at all
  ignore: ["#", "_", ">", "^", "*", "="],
  // If on of these characters included in string, it will not replace but add in warning to manual checking
  warnings: ["%", "{", "(", "}", ")", "$", "'"],
  // All extraction types: regular html texts; placeholder, alt and title attribute values; Strings marked with "#" character in begining
  extractions: ["text", "placeholder", "alt", "title", "hashtag"],
});
```

## Usage

Basic usage example:

_@todo update import_

```javascript
import HtmlStringsAffixer from "./../src/htmlStringsAffixer.js";

// Example of using HtmlStringsAffixer in a Laravel Blade template
const bladeTemplateContent = `
    <div>
        <h1>Welcome to our website</h1>
        <p>{{stayEnjoyment}}</p>
        <a href="/contact">Contact us</a>
    </div>
`;

const affixer = new HtmlStringsAffixer({
  prefix: "{{ __('", // Prefix to add before string
  suffix: "') }}", // Suffix to add after string
  extractions: [
    "text", // Since we have only texts
  ],
});
const localizedContent = affixer.affixIt(bladeTemplateContent);
console.log(localizedContent);
```

Check the other usage [examples](https://github.com/MaestroError/hsa-js/tree/maestro/examples):

- [blade](https://github.com/MaestroError/hsa-js/blob/maestro/examples/blade.example.js)
- [angular](https://github.com/MaestroError/hsa-js/blob/maestro/examples/angular.example.js)
- [react](https://github.com/MaestroError/hsa-js/blob/maestro/examples/react.example.js)
- [vue](https://github.com/MaestroError/hsa-js/blob/maestro/examples/vue.example.js)
- [report](https://github.com/MaestroError/hsa-js/blob/maestro/examples/report.example.js) (Returning report information)

## Contributing to hsa-js

We welcome contributions from the community and are delighted that you're interested in helping improve HtmlStringsAffixer! Whether you want to report a bug, request a feature, or contribute directly to the codebase, here's how you can get involved:

#### Reporting Bugs

If you encounter a bug while using HtmlStringsAffixer, we encourage you to report it. This helps us maintain the quality and reliability of the package. To report a bug:

1.  Visit the **Issues** section of the HtmlStringsAffixer GitHub repository.
2.  Before creating a new issue, please check if the bug has already been reported by another user. If so, you can add additional information to the existing report.
3.  If your issue is new, click on **New Issue** and select **Bug Report**.
4.  Fill in the issue template with as much detail as possible. Include steps to reproduce the bug, any error messages, and the environment (like the operating system and Node.js version) where the bug occurred.
5.  Submit the issue.

#### Requesting Features

Your ideas for new features are always welcome. To request a feature:

1.  Go to the **Issues** section of the HtmlStringsAffixer GitHub repository.
2.  Check if someone else has already requested a similar feature. If so, feel free to add your thoughts or additional suggestions to that request.
3.  If your feature request is unique, click on **New Issue** and select **Feature Request**.
4.  Describe the feature you'd like to see, explaining how it would work and why it would be a beneficial addition to HtmlStringsAffixer.
5.  Submit the feature request.

#### Contributing Code

Contributing directly to the codebase is a great way to help improve HtmlStringsAffixer. Here's how to get started:

1.  **Fork the Repository**: Navigate to the HtmlStringsAffixer GitHub page and fork the repository to your own GitHub account.
2.  **Clone Your Fork**: Clone your forked repository to your local machine.
3.  **Create a New Branch**: Always create a new branch for your work. This keeps your changes organized and separate from the main codebase.
4.  **Make Your Changes**: Implement your bug fix or feature.
5.  **Test Your Changes**: Ensure your changes don't break existing functionality and that they align with the overall design and coding style of the project.
6.  **Commit Your Changes**: Make concise and clear commit messages that explain your changes.
7.  **Submit a Pull Request**: Push your changes to your fork and submit a pull request to the original repository. In your pull request, provide a clear description of the problem and your solution.
8.  **Code Review**: Maintainers of the repository will review your code. Be open to feedback and any required changes.

#### Stay Involved

- **Star the Repository**: If you like HtmlStringsAffixer, consider starring the repository. This helps to grow the community and increases the visibility of the project.
- **Join Discussions**: Participate in discussions and provide feedback on proposed changes or features.

Your contributions, whether they're bug reports, feature requests, or code, play a significant role in the development of HtmlStringsAffixer. Together, we can build a tool that's more powerful, efficient, and user-friendly. Thank you for your support and involvement!

### Known issues

- While using hashtag ("#") extraction, it stops on " and ' characters, so `#John with "double"` will be replaced as `{{ __('John with') }} "double"`

##### To Do

- Hashtag extraction not working in input's values, make it work +
- Placeholder extraction isn't working +
- Replace found strings +
  - Problem with alt extraction, couldn't find +
- Create separated tests +
- Create report method and add count in it +
- Create usage examples +
- Add testing in github actions +
- Write docs +
- publish on NPM
  - To publish on NPM: `npm login` `npm publish`
