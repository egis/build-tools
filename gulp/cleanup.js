var gulp = require('gulp');
var delDist = require('./del-dist');
var common = require('./common');
var _ = require('lodash');

_.each(common.bundleKinds, function(kind) {
    gulp.task('del-' + kind + '-dist', function() {
        return delDist(common.dist[kind]);
    });
});
