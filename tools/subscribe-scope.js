const assert = require('./assert');

/**
 * Usage:
 * 
 * ```javascript
 * controller($scope, connection) {
 *     subscribeScope.call(connection.plugins.ping, $scope, pingHandler);
 * }
 * ```
 * 
 * or
 * 
 * ```javascript
 * service($rootScope, connection) {
 *     subscribeScope.call(connection.plugins.ping, $rootScope, pingHandler);
 * }
 * ```
 */
module.exports = function subscribeScope(scope, onNext, onError, onComplete) {
    assert(scope.hasOwnProperty('$parent'), 'First argument should be Angular scope');
    const wrapped = function (callback) {
        return function (data) {
            // (scope.$$phase || scope.$root.$$phase) ? callback(data) : scope.$apply(() => {
            scope.$applyAsync(() => {
                callback.call(null, data);
            });
        };
    };
    const disposable = this.subscribe(wrapped(onNext),
        onError ? wrapped(onError) : undefined,
        onComplete ? wrapped(onComplete): undefined);
    scope.$on('$destroy', function () {
        disposable.unscubscribe();
    });
};
