To publish on NPM:
npm login
npm publish

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
- Add testing in github actions
- Write docs
