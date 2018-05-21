var os = require('os');
var fs = require('fs');
var argv = require('optimist').argv;
var mkdirp = require('mkdirp');
var child_process = require('child_process');
var _ = require('lodash');
var log = require('loglevel');

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
    return './node_modules/@egis/egis-ui/build';
}

var EGISUI = findEgisUi();

// Level of logging verbosity: trace | debug | info | warn | error | silent
var logLevel = argv.egisLogLevel || 'warn';
log.setLevel(logLevel);
console.log('build tools: log level', log.getLevel());

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
        var outputDir = argv.outDir || 'test-output';

        var hostname = argv.host || process.env['IP'] || this.ip() || '';

        var launchersBase = 'TestingBot';
        var seleniumVersion = '3.4.0';
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
                version: '11'
            },
            'REMOTE-Safari9': {
                base: launchersBase,
                browserName: 'safari',
                version: '9'
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
        if (testingBotBuildName) {
            testingBotBuildName = '' + projectName + '/' + testingBotBuildName;
            projectName = testingBotBuildName;
        }

        var group_filename = function(base_fn, ext) {
            return _.compact([base_fn, argv.group]).join('-') + '.' + ext;
        };

        if ((argv.reporters || []).indexOf('testingbot') >= 0) {
            var tbConfig = {
                testName: (projectName || '') + ' Karma',
                recordVideo: true,
                recordScreenshots: true,
                connectOptions: {
                    verbose: false,
                    'se-port': 4445,
                    logfile: 'test-output/' + group_filename('testingbot_tunnel', 'log')
                },
                build: testingBotBuildName
            };
            Object.keys(customLaunchers).forEach(function (key) {
                customLaunchers[key]['selenium-version'] = seleniumVersion;
            });

            config.set({
                testingbot: tbConfig
            })
        }

        config.set({
            junitReporter: {
                outputDir: outputDir + '/junit/' // results will be saved as $outputDir/$browserName.xml
                //outputFile: undefined // if included, results will be saved as $outputDir/$browserName/$outputFile
                //suite: ''
            },
            hostname: config.hostname || hostname.split(' ').join(''),
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
            browsers: browsers,
            browserDisconnectTimeout: 10*1000, // default is 2000
            browserDisconnectTolerance: 1, // default is 0
            browserNoActivityTimeout: 4*60*1000, // default is 10*1000
            captureTimeout: 2*60*1000, // default is 60*1000
            htmlReporter: {
                outputFile: outputDir + '/' + group_filename('unit', 'html')
            },
            coverageReporter: {
                reporters: [
                    {
                        type : 'html'
                    }, {
                        type : 'lcov',
                        subdir : 'lcov'
                    }
                ]
            },
            colors: true,
            logLevel: config.LOG_INFO,
            autoWatch: true,
            singleRun: false,
        });
        if (argv.grep) {
            config.set({
                client: {
                    args: ['--grep', argv.grep]
                }
            });
        }
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
    },

    extend: function(a, b) {
        for (var key in b)
        {
            if (b.hasOwnProperty(key))
            {
                a[key] = b[key];
            }
        }

        return a;
    },

    defaultWdioConfig: function() {
        return require('./wdio.conf');
    },
    log: log
};