# Changelog

## 1.7.1

  - **Released Wednesday Febrary 18th, 12.55pm**
  - Finally added a basic [README](https://github.com/adamrenklint/asimov-static/blob/master/README.md)

## 1.7.0

  - **Released Wednesday Febrary 18th, 12.10pm**
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
