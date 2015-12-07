var del = require('del');

module.exports = function(dir)
{
    return del.sync(dir);
};
