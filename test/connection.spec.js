'use strict';
const assert = require('assert');
const Rx = require('rxjs');

describe('Connection', () => {
    const OC = require('../index');

    it('throws missing plugins option', () => {
        assert.throws(
            () => {return new OC.Connection();},
            err => /required/.test(err),
            'unexpected error thrown'
        );
    });

    it('throws on plugin which does not return observable', () => {
        function badPlugin() {
            return true;
        }
        assert.throws(
            () => {return new OC.Connection({plugins: [badPlugin]});},
            err => /Rx.Observable instance/.test(err),
            'unexpected error thrown'
        );
    });

    it('constructor works in happy case', () => {
        function emptyPlugin() {
            return Rx.Observable.empty();
        }
        assert(new OC.Connection({
            plugins: {emptyPlugin}
        }));
    });

    it('reports on plugin error', () => {
        function plugin() {
            throw new Error('foobar');
        }
        assert.throws(() => {
            new OC.Connection({ plugins: {plugin} });
        },
        err => /foobar/.test(err),
        'unexpected error thrown');
    });
});
