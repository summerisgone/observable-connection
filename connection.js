'use strict';
const assert = require('./tools/assert');
const rx = require('rxjs');

module.exports = class Connection {
    constructor(options) {
        this.options = Object.assign({}, options);
        assert(this.options.plugins, 'options.plugins is required');
        assert(this.options.plugins.length, 'options.plugins should be array of plugins');
        this.collectPlugins(this.options.plugins);
    }
    collectPlugins(plugins) {
        // pre-register
        this._pluginFns = {};
        plugins.forEach(plugin => {
            assert(plugin.name, `Plugin name should be defined for ${plugin}`);
            this._pluginFns[plugin.name] = plugin;
        });
        // instantiate
        this.plugins = {};
        plugins.forEach(plugin => {
            this.plugins[plugin.name] = this.inject(plugin.name);
        });
    }
    inject(pluginName) {
        const pluginFn = this._pluginFns[pluginName];
        assert(pluginFn, `Can't instantiate plugin ${pluginName}: it is ${this._pluginFns[pluginName]}`);
        const instance = pluginFn(this);
        assert(instance instanceof rx.Observable, `Plugin ${pluginName} doesn't return rx.Observable instance`);
        return instance;
    }
};
