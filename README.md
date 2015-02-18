asimov-static
================

[![NPM version](https://badge.fury.io/js/asimov-static.png)](http://badge.fury.io/js/asimov-static) [![Build Status](https://travis-ci.org/adamrenklint/asimov-static.png?branch=master)](https://travis-ci.org/adamrenklint/asimov-static) [![Code Climate](https://codeclimate.com/github/adamrenklint/asimov-static.png)](https://codeclimate.com/github/adamrenklint/asimov-static) [![Dependency Status](https://david-dm.org/adamrenklint/asimov-static.png?theme=shields.io)](https://david-dm.org/adamrenklint/asimov-static)

**Static site generator for [asimov.js](http://github.com/adamrenklint/asimov) and [asimov-server](http://github.com/adamrenklint/asimov-server)**

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014-2015. MIT licensed.

## Install

```
$ npm install --save asimov-static
```

## Usage

- Install the [asimov cli](https://github.com/adamrenklint/asimov.js#getting-started)
- Create a [new asimov project](https://github.com/adamrenklint/asimov.js#create-a-new-project)
- Add pages in ```/content``` using mixed [Markdown and YAML format](https://github.com/adamrenklint/asimov-static/blob/master/content/home.txt)
- Add [localized versions of page](https://github.com/adamrenklint/asimov-static/blob/master/content/home.de.txt)
- Add handlebars templates to ```/site/templates```
  - The name of the page textfile defines which template is used
- Add styles to ```/site/styles``` and include with ```{{style "foo"}}``` in your template
- Include any template as a partial with ```{{import "bar"}}```, and pass data with ```{{import "bar" object}}``` or ```{{import "bar" key="value"}}```
- Start with ```$ asimov``` or ```$ asimov debug```

### Advanced usage

- [add process initializers](https://github.com/adamrenklint/asimov.js#initializers)
- [add server request middleware](https://github.com/adamrenklint/asimov-server#middleware)
- [using plugins](https://github.com/adamrenklint/asimov.js#adding-plugins)
- [add cli commands](https://github.com/adamrenklint/asimov.js#create-a-new-command)

### Examples:

- [asimovjs.org](https://github.com/adamrenklint/asimovjs.org)

## Develop

### Testing

- Run unit tests with ```$ asimov test```
- Smoke tests are in [```/content/test```](https://github.com/adamrenklint/asimov-static/tree/master/content/test), run ```$ asimov``` to view

### Publish new version

- Bump version in ```package.json```, following [semver](http://semver.org/)
- Make sure the [README](https://github.com/adamrenklint/asimov-static/blob/master/README.md) reflects the changes
- Update the [changelog](https://github.com/adamrenklint/asimov-static/blob/master/CHANGELOG.md)
- Run ```$ make publish```

## Credits

Author: [Adam Renklint](http://adamrenklint.com). Contributors: [Adam Schroder](https://github.com/adamschroder), [Raymond May Jr](https://github.com/octatone).