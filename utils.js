var os = require('os');
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var mkdirp = require('mkdirp');
var child_process = require('child_process');
var _ = require('lodash');

function pathExists(path) {
    try {
        fs.statSync(path);
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            return false;
        }
    }
    return true;
}

function findEgisUi() {
    var egisUiPath = path.normalize('../EgisUI/build/');

    if (!pathExists(egisUiPath)) {
        egisUiPath = './node_modules/@egis/egis-ui/build'
    }
    return egisUiPath;
}

var EGISUI = findEgisUi();

module.exports = {

    EGISUI: EGISUI,

    unzip: function (path, to)
    {

        mkdirp(to);
        this.sh("unzip -o " + path + " -d " + to);
    },

    sh: function (cmd)
    {
        return child_process.execSync(cmd).toString('utf8').trim()
    },

    exists: function (path)
    {
        return pathExists(path);
    },
    dateFormat: function(date, fstr, utc) {
        utc = utc ? 'getUTC' : 'get';
        return fstr.replace (/%[YmdHMS]/g, function (m) {
            switch (m) {
                case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
                case '%m': m = 1 + date[utc + 'Month'] (); break;
                case '%d': m = date[utc + 'Date'] (); break;
                case '%H': m = date[utc + 'Hours'] (); break;
                case '%M': m = date[utc + 'Minutes'] (); break;
                case '%S': m = date[utc + 'Seconds'] (); break;
                default: return m.slice (1); // unknown code, remove %
            }
            // add leading zero if required
            return ('0' + m).slice (-2);
        });
    },
    defaultKarma: function (config)
    {
        var hostname = argv.host || process.env['IP'] || this.ip();

        var launchersBase = 'TestingBot';
        var customLaunchers = {
            'REMOTE-IE10': {
                base: launchersBase,
                browserName: 'internet explorer',
                platform: 'WIN8',
                version: '10'
            },
            'REMOTE-IE11': {
                base: launchersBase,
                browserName: 'internet explorer',
                platform: 'WIN10',
                version: '11'
            },
            'REMOTE-MSEdge': {
                base: launchersBase,
                browserName: 'microsoftedge',
                platform: 'WIN10'
            },
            'REMOTE-FF': {
                base: launchersBase,
                browserName: 'firefox',
                platform: 'WIN10'
            },
            'REMOTE-Safari': {
                base: launchersBase,
                browserName: 'safari',
                platform: 'CAPITAN'
            },
            'REMOTE-Chrome': {
                base: launchersBase,
                browserName: 'chrome',
                platform: 'CAPITAN'
            }
        };

        var browsers = Object.keys(customLaunchers);

        var projectName = argv.projectName;
        var testingBotBuildName = process.env.CIRCLE_BUILD_NUM;
        if (testingBotBuildName) testingBotBuildName = '' + projectName + '/' + testingBotBuildName;

        var group_filename = function(base_fn, ext) {
            return _.compact([base_fn, argv.group]).join('-') + '.' + ext;
        };
        config.set({
            junitReporter: {
                outputDir: 'test-output/junit/' // results will be saved as $outputDir/$browserName.xml
                //outputFile: undefined // if included, results will be saved as $outputDir/$browserName/$outputFile
                //suite: ''
            },
            hostname: hostname.split(' ').join(''),
            basePath: '',
            frameworks: ['jasmine-jquery', 'jasmine', 'fixture'],
            exclude: [],
            preprocessors: {
                '**/*.js': ['sourcemap'],
                '**/*.json'   : ['json_fixtures']
            },
            customLaunchers: customLaunchers,
            jsonFixturesPreprocessor: {
                variableName: '__json__'
            },
            reporters: ['progress', 'html', 'junit', 'verbose'],
            testingbot: {
                testName: (projectName || '') + ' Karma',
                recordVideo: true,
                recordScreenshots: true,
                connectOptions: {
                    verbose: false,
                    'se-port': 4445,
                    logfile: 'test-output/' + group_filename('testingbot_tunnel', 'log')
                },
                build: testingBotBuildName
            },
            browsers: browsers,
            browserDisconnectTimeout: 10*1000, // default is 2000
            browserDisconnectTolerance: 1, // default is 0
            browserNoActivityTimeout: 4*60*1000, // default is 10*1000
            captureTimeout: 2*60*1000, // default is 60*1000
            htmlReporter: {
                outputFile: 'test-output/' + group_filename('unit', 'html')
            },
            colors: true,
            logLevel: config.LOG_INFO,
            autoWatch: true,
            singleRun: false,
            hostname: config.hostname.split(' ').join('')
        });
    },

    ip: function ()
    {
        var ifaces = os.networkInterfaces();
        var ip;
        Object.keys(ifaces).forEach(function (ifname)
        {
            ifaces[ifname].forEach(function (iface)
            {

                if ('IPv4' !== iface.family || iface.internal !== false || iface.address.startsWith('172'))
                {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                ip = iface.address;
            });

        });
        return ip;
    }
};