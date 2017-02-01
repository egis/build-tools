See [CODESTYLE](CODESTYLE.md)  

## Naming Conventions / Directory Layout

```
build/ 		# compiled and concatenanted classes
dist/ 		# compiled JS classes
src/ 		#  ES6 and Handlebars templates
style/ 		# LESS, SASS or, CSS
resource/	# Copied as is to build directory
lib-export.js	# the entrypoint ala index.js
```

## Build Pipeline

* All bower dependencies are downloaded and concatenated into `build/dependencies.js` and `build/dependencies.css`
* ES6 files are compiled and concatenanted into `build/app.js` where 'app.js' is the `mainFile` in `package.json` 
(inferred from package's name by default)
* CSS/LESS/SASS are compliled and concatened into `build/app.css`
* In production mode all source is minified and source maps generated.

## Handlebars Templates

A Handlebar template is any file ending in `.hbs` it is available in the `TEMPLATES` global without the extension.  
A Handlebar partial is any file begining with `_` and ending in `.hbs` and is automatically registered  



## Build steps:
* export your `NPM_TOKEN`
* Copy and rename the seed_package.json to package.json (only when bootstraping new projects)
* Run `npm run setup` to install and build all required dependencies 
* Run `npm run dev` to  build files suitable for wathcing and startup a watch server
* Run `npm run build` to build a package suitable for production
* Run `npm run test` to run karma test suites


## Customizing builds using bower.json and package.json

### bower.json
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

