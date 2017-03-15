const Rx = require('rxjs');

/**
 * Use this to catch errors in AJAX streams
 */
module.exports = function catchPromise (promise) {
    return Rx.Observable.defer(() => {
        const subject = new Rx.AsyncSubject();
        promise.then(value => {
            subject.next(value);
            subject.complete();
        }).catch(error => {
            subject.next(error);
        });
        return subject;
    });
};