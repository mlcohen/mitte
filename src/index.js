import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

function applyMiddlewareLayers (layers, index, key, args, handler) {
    const layer = layers[index];

    if (!layer) {
        if (handler) {
            handler.apply(null, args);
        }
        return;
    }

    function next (...args) {
        applyMiddlewareLayers(layers, index + 1, key, args, handler);
    }

    if (key) {
        const method = layer[key];

        if (!method) {
            next.apply(null, args);
        } else {
            method.apply(layer, [...args, next]);
        }
    } else if (isFunction(layer)) {
        layer.apply(null, [...args, next]);
    } else {
        next.apply(null, args);
    }
}

const Middleware = function () {
    this._layers = [];
};

Middleware.prototype.use = function use (...args) {
    const layers = isArray(args[0]) ? args[0] : args;
    this._layers = this._layers.concat(layers);
    return this;
};

Middleware.prototype.apply = function apply (args, handler) {
    applyMiddlewareLayers(this._layers, 0, null, args, handler);
};

Middleware.prototype.applyForKey = function applyForKey (key, args, handler) {
    applyMiddlewareLayers(this._layers, 0, key, args, handler);
};

function createMiddleware () {
    return new Middleware();
}

export {
    createMiddleware
}