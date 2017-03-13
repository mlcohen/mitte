# Mitte

A small and simple general purpose middleware library.


### Installation

To install a stable version:

```
npm install mitte
```

### What's in the box?

Start by creating a middleware manager by calling `mitte()`. The middleware manager is responsible for keeping track of layers of middleware and running them.

```js
import { mitte } from 'mitte';

const middleware = mitte();
```

Once you have a middleware manager, you can add layers of middleware by calling the manager's `use` method in a variety of ways:

```js
/**
 * Add a middleware layer that is associated with no key.
 */
middleware.use((value, next) => {
    next(value);
});

/**
 * Add a middleware layer that is associated with a key.
 */
middleware.use('route', (request, reponse, next) => {
	next(request, response);
})

/**
 * Add a middleware layer containing a set of handlers associated
 * with different keys.
 */
middleware.use({

    open: (next) => {
        next();
    }

    close: (next) => {
    	next();
    }

    route: (request, response, next) => {
    	next(request, response);
    }

    process: (value, next) => {
    	next(value);
    }

});

/**
 * Add multiple layers of middleware in one call.
 */
middleware.use([{
	route: (request, response, next) => { ... }
}, {
   route: (request, response, next) => { ... },
   process: (value, next) => { ... }
}]);

```

After you've added your layers of middleware, you can run them:

```js
/**
 * Run middleware layers not associated with a key
 */
middleware.run(value, (err, value) => {
    ...
});

/**
 * Run middleware layers that are associated with a key.
 */
middleware.runForKey('route', request, response, (err, req, res) => {
    ...
});
```

That's all there is to it.

When you run middleware you also supply a final handler to complete any necessary work and deal with potential errors.

If a middleware layer does not have a handler associated with a key the layer is simply skipped and the next layer is tried.

### License

MIT
