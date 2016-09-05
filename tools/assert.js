'use strict';
const isNode = require('detect-node');

if (isNode) {
    module.exports = require('assert');
} else {
    module.exports = function(exprssion, message) {
        /* eslint no-console: "off" */
        return exprssion || console.error(message);
    };
}
