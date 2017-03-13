import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

function runMiddleware (middleware, index, key, args, handler) {
    const layer = middleware[index];

    if (!layer) {
        if (handler) {
            handler.apply(null, [null, ...args]);
        }
        return;
    }

    const next = (...args) => {
        if (args.length === 1 && args[0] instanceof Error) {
            handler.call(null, args[0]);
            return;
        }

        runMiddleware(middleware, index + 1, key, args, handler);
    };

    if (key) {
        const method = layer[key];

        if (!method) {
            next.apply(null, args);
        } else {
            tryRunningMiddlewareLayer(method, layer, args, next, handler);
        }
    } else if (isFunction(layer)) {
        tryRunningMiddlewareLayer(layer, null, args, next, handler);
    } else {
        next.apply(null, args);
    }
}

function tryRunningMiddlewareLayer (layer, context, args, next, handler) {
    try {
        layer.apply(context, [...args, next]);
    } catch (err) {
        handler.apply(null, [err]);
    }
}

function processMittewareRunArguments (args) {
    const len = args.length;
    const args_ = args.slice(0, len - 1);
    const handler = args[len - 1];
    return [args_, handler];
}

function normalizeMittewareUseArguments (args) {
    if (args.length === 1) {
        return isArray(args) ? args: [args[0]];
    }

    if (args.length >= 2) {
        const key = args[0];
        const middleware = args[1];

        if (!isString(key)) {
            throw new Error('Invalid Argument: Key must be a string');
        }

        return (isArray(middleware) ? middleware : [middleware]).map(layer => ({
            [key]: layer
        }));
    }

    return [];
}

const Mitte = function () {
    this._middleware = [];
};

Mitte.prototype.use = function use (...args) {
    const middleware = normalizeMittewareUseArguments(args);
    this._middleware = this._middleware.concat(middleware);

    return this;
};

Mitte.prototype.run = function run (...args) {
    const [args_, handler] = processMittewareRunArguments(args);
    runMiddleware(this._middleware, null, 0, args_, handler);
};

Mitte.prototype.runForKey = function runForKey (key, ...args) {
    const [args_, handler] = processMittewareRunArguments(args);
    runMiddleware(this._middleware, key, 0, args_, handler);
};

function mitte () {
    return new Mitte();
}

export {
    mitte,
};
