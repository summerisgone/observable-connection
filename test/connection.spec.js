'use strict';
const assert = require('assert');
const rx = require('rxjs');

describe('Connection', () => {
    const OC = require('../index');

    it('throws missing plugins option', () => {
        assert.throws(
            () => {return new OC.Connection();},
            err => /required/.test(err),
            'unexpected error thrown'
        );
    });

    it('throws on empty plugins', () => {
        assert.throws(
            () => {return new OC.Connection({plugins: []});},
            err => /should be array of plugins/.test(err),
            'unexpected error thrown'
        );
    });

    it('throws on plugin without name', () => {
        const nonamePlugin = function() {
            return rx.Observable.empty();
        }
        assert.throws(
            () => {return new OC.Connection({plugins: [nonamePlugin]});},
            err => /name should be defined/.test(err),
            'unexpected error thrown'
        );
    });

    it('throws on plugin which does not return observable', () => {
        function badPlugin() {
            return true;
        }
        assert.throws(
            () => {return new OC.Connection({plugins: [badPlugin]});},
            err => /rx.Observable instance/.test(err),
            'unexpected error thrown'
        );
    });

    it('contructor works in happy case', () => {
        function emptyPlugin() {
            return rx.Observable.empty();
        }
        assert(new OC.Connection({
            plugins: [emptyPlugin]
        }));
    });

    it('allows to mimic function', () => {
        const myPlugin = function() {
            return rx.Observable.empty();
        };
        Object.defineProperty(myPlugin, 'name', {writable: true});
        myPlugin.name = 'foobar';
        const connection = new OC.Connection({plugins: [myPlugin]});
        assert(connection.plugins.foobar);
    });
});
