# Gulp based builds.

## MacOSX: Installing glue:
```shell
# install 'native' (not Apple-supplied) Python to be able to install 'glue' tool:
brew install python

# install 'glue' tool needed by build:
brew install jpeg
pip install glue

# install Karma globally for tests to start:
npm install -g karma-cli
```

## Build steps:
* export your `NPM_TOKEN`
* Copy and rename the seed_package.json to package.json (only when bootstraping new projects)
* Run `npm run setup` to install and build all required dependencies 
* Run `npm run dev` to  build files suitable for wathcing and startup a watch server
* Run `npm run build` to build a package suitable for production
* Run `npm run test` to run karma test suites
* The build scripts create  `build/webapps/EgisUI.war` file containing concatenated and minified javascript.
* To add the library in your Java project, drop the above `EgisUI.war` file in your `webapps` folder and include the following in your web page:

```
    <!--Load the EgisUI libraries at the end -->
        <script type="text/javascript" src="/web/EgisUI/dependencies.js"></script>
        <script type="text/javascript" src="/web/EgisUI/egis-ui.js"></script>
    <!--Load the EgisUI libraries at the end -->
        <link href="/web/EgisUI/dependencies.css" rel="stylesheet"/>
        <link href="/web/EgisUI/theme.css" rel="stylesheet"/>
        <link href="/web/EgisUI/egis-ui.css" rel="stylesheet"/>
        <link href="/web/EgisUI/iconmoon.css" rel="stylesheet"/>
	
```
* To load a specific version of the libraries, provide the short commit hash of the version that you want to load:

```
        <script type="text/javascript" src="/web/EgisUI/egis-ui.js?rel=498ca6a"></script>
        <link href="/web/EgisUI/dependencies.css?rel=498ca6a" rel="stylesheet"/>
```
* To load sourcemaps for use in debugging, add the following entries to your web page:

```
        <script type="text/javascript" src="/web/EgisUI/dependencies.js.map"></script>
        <script type="text/javascript" src="/web/EgisUI/egis-ui.js.map"></script>

```

* `EgisUI` currently uses `jQuery` version `2.1.4`. If your project or its direct or indirect dependencies already contain another version of `jQuery` it may conflict with `EgisUI`.
* If you need to check what version of `jQuery` is being used in your project, type the following in the javascript console of your browser:
```
> $.fn.jquery
```
If the output says `undefined` then your project does not already have `jQuery` and you can go ahead and start using this library. Anything other than version `2.1.4` may conflict with this version of `EgisUI`.
* Currently, `ptlib.js` from `WebComponents` project does not work with `EgisUI` as `ptlib` uses `jQuery` `1.7.2`
* The entry point of your application will be `EgisUI.loaded` function that is invoked once the `EgisUI` library has finished loading:

```
    <script>
        EgisUI.loaded(function() {
            console.log('Egis UI load in graph editor');
        });
    </script>
```
* The `EgisUI` object binds itself to the global `window.UI` object that can be be used in your application to refer to `EgisUI`. For details checkout the `api` documentation.

## Build pipeline

###stlye/*.less, *.sass, *.css
	Run through SASS or LESS >  dist/ -> concat -> uglify -> gzip -> build/ 

###src/*.js
	Babel (ES6) > concat -> uglify -> gzip -> build/ 

Concatenation order is specifed by the ES6 import declaration
```javascript
import assign from './utils/Utils.js'
import Form from './Form.js'
```	


		
###src/*.hbs
	Handlebars -> concat into main JS, available in browser as TEMPLATES['name without extension']
	
###resources/*, *.html
	Copied as is to build directory
	
###sprites/{set}/*.png|jpg|gif

Compiles all images into a single sprite call {set}.png sprites can be used like:

```html
<span class="sprite-{set}-{filebase}"/>
```

## Customizing builds using bower.json and package.json


#### bower.json
All bower dependencies with main files are concatenanted together, this can be overriden in bower.json as follows:

```json 
"overrides": {
           "bootstrap": {
               "main": [
                    "dist/js/bootstrap.js",
                    "dist/css/bootstrap.css", 
                    "dist/css/bootstrap.css.map"
               ]
           },
 }   
```

To exclude certain large libraries from concatenantion list in exclude, the main files will be concated together and placed in build/<libray name>
```json
   "standalone": ["handsontable", "codemirror"]
```

To exclude libraries that have already been packaged elsewhere:
```json
"excludes": ["jquery"]
```

To copy entire directories from dependencies:

```json
"directories": {
    "fontawesome": "fonts/*",
    "bootstrap": "fonts/*"
  },
```

To create a plugin package:

```json
"plugin": "PortalApp",
```
This will create a .zip instead of a .war and place all the compiled .js file in to a subdirectory *System/plugins/{plugin}*

