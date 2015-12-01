var del = require('del');

module.exports = function()
{
    return del.sync('dist');
};
