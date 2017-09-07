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

function applyMiddlewareLayersAsync (layers, index, key, args) {
    return new Promise((resolve, reject) => {
        const layer = layers[index];

        if (!layer) {
            resolve({
                applyNextLayer: false,
                args: args
            });
            return;
        }

        function next (...args) {
            resolve({
                applyNextLayer: true,
                args: [layers, index + 1, key, args]
            });
        }

        if (key) {
            const method = layer[key];

            if (!method) {
                next.apply(null, args);
            } else {
                method.apply(layer, [...args, next, reject]);
            }
        } else if (isFunction(layer)) {
            layer.apply(null, [...args, next, reject]);
        } else {
            next.apply(null, args);
        }
    }).then(({ applyNextLayer, args }) =>
        applyNextLayer ? applyMiddlewareLayersAsync.apply(null, args) : args
    );
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

Middleware.prototype.applyAsync = function applyAsync (args) {
    return applyMiddlewareLayersAsync(this._layers, 0, null, args);
};

Middleware.prototype.applyForKey = function applyForKey (key, args, handler) {
    applyMiddlewareLayers(this._layers, 0, key, args, handler);
};

Middleware.prototype.applyForKeyAsync = function applyForKeyAsync (key, args) {
    return applyMiddlewareLayersAsync(this._layers, 0, key, args);
};

function createMiddleware () {
    return new Middleware();
}

export {
    createMiddleware
};
