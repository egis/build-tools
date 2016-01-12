var os = require('os');
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var mkdirp = require('mkdirp');
var child_process = require('child_process');
var _ = require('lodash');

module.exports = {

    buildDir: function ()
    {
        var EGISUI = path.normalize('../EgisUI/build/');

        if (this.exists('./EgisUI.war'))
        {
            EGISUI = 'build/EgisUI/';
            this.unzip("./EgisUI.war", EGISUI)
        }

        console.log(EGISUI);
        return EGISUI;
    },


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
        try
        {
            fs.statSync(path);
        }
        catch (err)
        {
            if (err.code == 'ENOENT')
            {
                return false;
            }
        }
        return true;

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
        this.buildDir();
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
                platform: 'WIN10',
                version: '20'
            },
            'REMOTE-FF': {
                base: launchersBase,
                browserName: 'firefox',
                platform: 'WIN10',
                version: '43'
            },
            'REMOTE-Safari': {
                base: launchersBase,
                browserName: 'safari',
                platform: 'CAPITAN',
                version: '9'
            }
        };

        var extra = {
            'REMOTE-Chrome': {
                base: launchersBase,
                browserName: 'chrome',
                platform: 'MAVERICKS',
                version: '47'
            }
        };

        // testingbot time cost money so we don't want to run extra on regular basis. REMOTE-Chrome is extra because there's also a local Chrome
        // customLaunchers = _.assign(customLaunchers, extra);

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
                '**/*.coffee': ['coffee'],
                '**/*.js': ['sourcemap'],
                '**/*.json'   : ['json_fixtures']
            },
            customLaunchers: customLaunchers,
            jsonFixturesPreprocessor: {
                variableName: '__json__'
            },
            reporters: ['progress', 'coverage', 'html', 'junit', 'verbose'],
            testingbot: {
                testName: (argv.testName || '') + ' Karma',
                screenrecorder: true,
                screenshots: true,
                connectOptions: {
                    verbose: true,
                    'se-port': 4445,
                    logfile: 'testingbot_tunnel.log'
                }
            },
            browsers: Object.keys(customLaunchers).concat(['Chrome']),
            browserNoActivityTimeout: 200000,
            htmlReporter: {
                outputFile: 'test-output/unit.html'
            },
            coverageReporter: {
                reporters: [
                    { type: 'html', dir: 'coverage' }
                ]
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
