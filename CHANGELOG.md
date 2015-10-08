# Changelog

## 2.2.2

- **Released Thursday October 8th, 2015 @ 14.55pm**
- CHANGED: Redirect localized root pages accessed with ```/home``` alias to non-aliased url

## 2.2.1

- **Released Friday August 28th, 2015 @ 15.30pm**
- FIXED: Health check being unreachable in ```USE_STATIC_PUBLIC``` mode

## 2.2.0

- **Released Friday August 28th, 2015 @ 13.00pm**
- CHANGED: Remove Babelify transform for script bundles

## 2.1.0

- **Released Friday August 28th, 2015 @ 12.45pm**
- NEW: Serve prebuilt static content with ```USE_STATIC_PUBLIC``` environment variable
- NEW: Prebuild command aliased to environment variable ```PREBUILD_STATIC_PUBLIC``` to avoid needing ```ENV``` to be set

## 2.0.0

- **Released Friday July 3rd, 2015 @ 11.26pm**
- NEW: Prebuild entire website to ```/public``` and exit with ```ENV=prebuild```
- NEW: Client-side scripts are transformed with [babel](http://babeljs.io)
- CHANGED: Use asimov 1.3 and asimov-server 1.5.0
- FIXED: syntax highlighted code blocks within pre blocks have incorrect leading padding
- FIXED: highlight.js ignores defined language, always uses auto-detect
- CHANGED: ScriptDependencyParser continues searching even after one dependency is not found
- FIXED: Queue should not continue until all current jobs are completed

## 1.13.1

  - **Released Sunday March 15th, 2015 @ 3.25pm**
  - NEW: ```site/files``` folder is symlinked to ```public/site/files```, if it exists

## 1.13.0

  - **Released Friday March 13th, 2015 @ 4.05pm**
  - NEW: Github style syntax highlighting by adding ```{{style "asimov.highlight"}}```
  - CHANGED: Removed automatic favicon insertion

## 1.12.1

  - **Released Thursday March 12th, 2015 @ 3.35pm**
  - FIXED: ```page.isHidden()``` returns false for pages without a ```position``` attribute

## 1.12.0

  - **Released Wednesday February 25th, 2015 @ 15.30am**
  - **Revert breaking change in 1.11**: page attribute keys are now available again as lowercased additionally to being available in its original case

## 1.11.1

  - **Released Wednesday February 25th, 2015 @ 11.30am**
  - Throw error if Helper name is not defined
  - Fix issue where ```page.pkg``` was always undefined instead of reflecting ```package.json```
  - Fix issue with deprecated lowercased helpers not returning the same value as the case sensitive version

## 1.11.0

  - **Released Tuesday February 24th, 2015 @ 6.50pm**
  - **Breaking**: page attribute keys are no longer lowercased, to be consistent with parsed YAML objects and because *magic sucks* [19](https://github.com/adamrenklint/asimov-static/issues/19)
  - **Deprecated**: helper names are no longer automatically lowercased, but will continue to work with a deprecation warning
  - Fix issue with ```helper.html()``` leaking the page attribute ```page```

## 1.10.0

  - **Released Monday February 23rd, 2015 @ 4.25pm**
  - When a localized page is missing an attribute value, fall back to the default language page value, unless [```asimov.config("defaultLangFallback")```](https://github.com/adamrenklint/asimov-static/blob/master/README.md#configuration) is set to ```FALSE```
  - Update browserify, handlebars, marked, stylus, yaml-js

## 1.9.3

  - **Released Monday February 23rd, 2015 @ 2.55pm**
  - Changed ```/health``` check endpoint to return ```{"up":true}```, and be aliased on ```/api/health```

## 1.9.2

  - **Released Friday February 20th, 2015 @ 2.45pm**
  - Fixed issue in ```/health``` ping endpoint, where the request was left hanging
  - Fixed unhandled error in script prender chain

## 1.9.1

  - **Released Friday February 20th, 2015 @ 12.55pm**
  - Fixed unhandled error in "dirty render check"

## 1.9.0

  - **Released Friday February 20th, 2015 @ 12.20pm**
  - Use asimov-server 1.4.0
  - Improved ```/health``` ping endpoint, will now return **404** until initial render queue is processed [16](https://github.com/adamrenklint/asimov-static/pull/16)

## 1.8.0

  - **Released Thursday February 19th, 2015 @ 10.45am**
  - Improved sitemap generator [15](https://github.com/adamrenklint/asimov-static/pull/15)
    - Now includes all pages not prefix with ```_```
    - Add alternate language identifiers for pages with localizations
    - Make sitemap URL protocol configurable

## 1.7.1

  - **Released Wednesday February 18th, 2015 @ 12.55pm**
  - Finally added a basic [README](https://github.com/adamrenklint/asimov-static/blob/master/README.md)

## 1.7.0

  - **Released Wednesday February 18th, 2015 @ 12.10pm**
  - Decoupled rendering page attributes from rendering page templates, solving issues where nested child page attributes are raw when rendering

## 1.6.0

  - **Released Friday February 6th, 2015 @ 4.05pm**
  - Added ```compile``` flag to ```{{style}}``` helper, pass ```false``` to skip stylus preprocessing and instead treat as plain CSS

## 1.5.5

  - **Released Wednesday January 28th, 2015 @ 10:50am**
  - Fixed an issue where in DEV mode, urls like ```/de/?foo=bar``` would never render the right file [13](https://github.com/adamrenklint/asimov-static/pull/13)

## 1.5.4

  - **Released Tuesday January 27th, 2015 @ 5.10pm**
  - Fixed an issue in ```PagePostRender``` which used the incorrect localized url [12](https://github.com/adamrenklint/asimov-static/pull/12)

## 1.5.3

  - **Released Wednesday January 7th, 2015 @ 11.30am**
  - Fixed an issue where a site with with several templates with similar names would end up registering a random dependency graph
  - Fixed an issue where trailing section delimiters, without a trailing newline, would be converted to &lt;h2&gt;

## 1.5.2

  - **Released Monday January 5th, 2015 @ 12.20pm**
  - Fixed an issue where valid urls (with trailing slash) would return 404 in lazy rendering mode

## 1.5.1

  - **Released Thursday December 18th, 2014 @ 5.15pm**
  - Now printing status code in response logger
  - Lazy rendering is now only used when ```ENV``` is set to ```"development"```

## 1.5.0

  - **Released Wednesday December 17th, 2014 @ 4pm**
  - Much faster process startup in development mode by not pre-rendering all pages and asset files
  - Automatic restart when modifying initializer or middleware (in development mode)
  - Response time logging, both in process logger and response headers
  - Faster response times for pages in production mode, using an in-memory cache

## 1.4.1

  - **Released Wednesday December 3rd, 2014 @ 2pm**
  - Scope ```PagePostRender#localizeUrls``` to urls in links [8](https://github.com/adamrenklint/asimov-static/pull/8)

## 1.4.0

  - **Released Friday November 28th, 2014 @ 6pm**
  - Update [asimov-server](http://github.com/adamrenklint/asimov-server) to v1.1.0

## 1.3.0

  - **Released Friday November 28th, 2014 @ 4.55pm**
  - Update [asimov](http://github.com/adamrenklint/asimov) to v1.1.0

## 1.2.0

  - **Released Friday November 14th, 2014 @ 5pm**
  - Added ```req.original_url``` to requests that have been redirected by middlewares

## 1.1.1

  - **Released Monday November 10th, 2014 @ 12pm**
  - Fixed issue where imported script bundles with mangled require paths would keep on crashing the server

## 1.1.0

  - **Released Tuesday October 21st, 2014 @ 5pm**
  - All collections used to build the static site is now exposed on ```asimov.collections``` (pages, styleSheets, scripts, templates, helpers and siteData)
  - Fixed performance issue with ```{{import}}``` helper

## 1.0.0

  - **Released Saturday September 27th, 2014 @ 11.25am**
  - Bump to version 1.0, API is stable and all future updates and changes will follow sematic versioning

## 0.1.9

  - **Released Wednesday August 27th, 2014 @ 10.35am**
  - Fix issue with Watcher not excluding ```/public``` and crashing on restart because of symlinked images

## 0.1.6

  - **Released Wednesday August 20th, 2014 @ 11.50am**
  - Symlink ```site/fonts``` to build destination folder

## 0.1.6

  - **Released Thursday July 31st, 2014 @ 6.35pm**
  - Youtube helper url is not protocol relative

## 0.1.5

  - **Released Thursday July 31st, 2014 @ 2.25pm**
  - LiveReload is now only active when ```ENV``` is ```"development"```

## 0.1.4

  - **Released Wednesday July 30th, 2014 @ 7.30pm**
  - Update asimov-server, that exposes ```/health``` endpoint for service discovery

## 0.1.3

  - **Released Wednesday July 30th, 2014 @ 4.05pm**
  - Added the same render lifecycle events that already exists for Page to Script and StyleSheet: ```pre:render:script```, ```post:render:script```, ```pre:render:stylesheet```, ```post:render:stylesheet```

## 0.1.2

  - **Released Tuesday July 29th, 2014 @ 4.05pm**
  - The ```{{children}}``` helper will automatically use localized pages when they exist

## 0.1.1

  - **Released Tuesday July 22nd, 2014 @ 1.45pm**
  - Automatically redirect to localized page, if existing

## 0.1.0

  - **Released Monday July 21st, 2014 @ 4.50pm**
  - Ported from asimov.js
  - Removed implicit inheritance for localized pages
