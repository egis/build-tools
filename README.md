See [CODESTYLE](CODESTYLE.md)  

## Naming Conventions / Directory Layout

```shell
build/ 		# compiled and concatenanted classes
dist/ 		# compiled JS classes
src/ 		#  ES6 and Handlebars templates
style/ 		# LESS, SASS or, CSS
resource/	# Copied as is to build directory
lib-export.js	# the entrypoint ala index.js
```

## Build Pipeline

* All web dependencies are downloaded and concatenated into `build/dependencies.js` and `build/dependencies.css`
* ES6 files are compiled and concatenanted into `build/app.js` where 'app.js' is the `mainFile` in `package.json` 
(inferred from package's name by default)
* CSS/LESS/SASS are compliled and concatened into `build/app.css`
* In production mode all source is minified and source maps generated.

## Handlebars Templates

A Handlebar template is any file ending in `.hbs` it is available in the `TEMPLATES` global without the extension.  
A Handlebar partial is any file begining with `_` and ending in `.hbs` and is automatically registered  

## Build steps:
* export your `NPM_TOKEN`
* Run `npm install -g "yarn@^1.5.1"` 
* Run `yarn setup` to install and build all required dependencies

## Dev lifecycle commands:
* Run `yarn setup` to install dependencies of client project if its package.json is updated upstream
* Run `yarn add my-package` to add a dependency to build-tools  
* Run `yarn add --dev my-package` to add a build-time dependency to client project if needed  
* Run `yarn add my-package` to add a web dependency to client project if needed. Note that EgisUI's dependencies are 
included everywhere.
* Run `yarn upgrade my-package` to upgrade a dependency in build-tools or client project.  
* Run `yarn dev` to  build files suitable for wathcing and startup a watch server
* Run `yarn build` to build a package suitable for production
* Run `yarn test` to run karma test suites


## Customizing builds using dependencies.json and package.json

### dependencies.json
All web dependencies with main files are concatenanted together, this can be overriden in dependencies.json as follows:

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

### Browsersync

For frontend development env our browsersync integration may be helpful. It:
* injects CSS changes immediately
* auto-reloads page in browsers if JS files are changed - including your mobile device's browser 
* supports running multiple modules in dev mode in parallel

In each *build-tools* project:  
```bash
yarn dev
```
And then after 1 or more `yarn dev` servers are running:  
```
yarn browsersync
```

If your files are being served from anything other then **localhost** e.g. **192.168.99.100**: 

```bash
cd /path/to/EgisUI
yarn dev

# in another terminal window/tab
cd /path/to/build-tools
yarn browsersync -- --proxied-host=192.168.99.100
```

This also allows to run a library (EgisUI, eSign, etc) or Portal plugin locally in dev mode in context of remote host, e.g. UAT:
```bash
cd /path/to/MyPlugin
yarn dev

# in another terminal window/tab
cd /path/to/build-tools
yarn browsersync -- --proxied-host=sandbox.some.com --proxied-port=80 --plugin=MyPlugin
```

Note the `--plugin` parameter above - you need to specify it by its directory name to make browsersync handle it. This 
is because we only want one plugin to work at any given time. 

For SSL mode, just specify https protocol:
```
yarn browsersync -- --proxied-host=https://testbox.papertrail.co.za
```

#### Caveats
 * URLs with default pages other than index.html, e.g. `http://papertrail.lvh.me:3001/web/eSign/?3760` don't work, so 
 you'll get "page not found" if you try to use Sign action. Specify `http://papertrail.lvh.me:3001/web/eSign/sign.html?3760` 
 manually then, that will work.
 
### E2E tests
We use [Webdriver.io](http://webdriver.io/) with [Mocha](https://mochajs.org/) for e2e tests.
 
#### Results at CI
If the e2e tests are failing you can check their output for 'failing' substring to see which specs are failing. Also 
build artifacts can give a hint on it - the failing tests will usually have screenshot for 6 retries like 
[here](docs/failing-e2e-artifacts.png). Note that EgisUI runs its main dependencies' (Portal, eSign, etc) e2e specs at 
CI, to make sure the EgisUI changes doesn't break them. This can be seen in  e2e tests output like 
[here](docs/egisui-dependency-e2e-specs.png).

#### Running locally
The best way to run e2e tests locally is via Docker container for PT, see its installation steps 
[here](http://developer.papertrail.co.za/Reference/Dev-Environment.html#Docker). This will make sure you have the same 
PT configuration as CI does. After installing and running docker container for PT start webdriver-manager:
```
npm install -g webdriver-manager # needed once
# in a separate terminal window/tab
webdriver-manager update # this is needed at first installation and later after browsers update their versions
webdriver-manager start
```
Then load project's e2e fixtures and update the container apps:
```
cd MY_EGIS_DIR/eSign # or EgisUI, etc
export PT_API="http://192.168.99.100:8080" # put your docker's host and port here
cd e2e && ./fixtures.sh && cd ..
docker cp eSign.war my-pt:/opt/Papertrail/webapps # correct war filename for different project
docker cp ../EgisUI/EgisUI.war my-pt:/opt/Papertrail/webapps # if you want to test the project with your latest EgisUI build
```

Run the tests:
```
# Put your docker's host and port here, spec file(s) mask and the spec name(s) substring.
yarn test:e2e -- --baseUrl="http://192.168.99.100:8080" --specFiles="./e2e/**/Guide*Spec.js" --mochaOpts.grep="too early" --maxBrowserInstances=1 --mochaOpts.retries=1 
```

#### Semantic-release
To see locally which version is going to be published when your PR is merged, run this:
```
BRANCH=testingbot yarn simple-semantic-release-pre
``` 
Put your actual branch name into BRANCH=... part.