# Mitte

A small and simple general purpose middleware library.


### Installation

To install a stable version:

```
npm install --save mitte
```

### What's in the box?

Start by creating a middleware manager by calling `createMiddleware()`. The middleware manager is responsible for keeping track of layers of middleware and applying inputs to them.

```js
// es6
import { createMiddleware } from 'mitte';

const middleware = createMiddleware();
```

```js
// es5 (commonjs)
var createMiddleware = require('mitte').createMiddleware;

var middleware = createMiddleware();
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
middleware.use(
	{
		route: (request, response, next) => { ... }
	}, 
	{
		route: (request, response, next) => { ... },
		process: (value, next) => { ... }
	}
);

```

After you've added your layers of middleware, you can apply input to them:

```js
/**
 * Run middleware layers not associated with a key
 */
middleware.apply([request, response]);

/**
 * Run middleware layers that are associated with a key.
 */
middleware.applyForKey('route', [request, response]);
```

That's all there is to it.

When you apply input to your middleware, you may also supply a final handler to complete any necessary work.

```js
middleware.apply([value], (value) => ...);

middleware.applyForKey('process', [value], (value) => ...);
```

If a middleware layer does not have a handler associated with a key the layer is simply skipped and the next layer is tried.

### API

#### `createMiddleware()`

Create a new instance of a middleware manager.

##### Returns

MiddlewareManager

#### `MiddlewareManager`

Manages layers of middleware. 

##### Methods

- `use(layers)`
- `apply(values, [handler])`
- `applyForKey(key, values, [handler])`

#### `MiddlewareManager.use(layers)`

Adds one or more layers. Middleware layers are order based on the order they are supplied to the method.

Layers can be added as individual arguments or as a single array.

##### Examples

```js
// Add an individual layer not associated with a key.
middleware.use((value, next) => ...);
```

```js
// Add a layer consisting of handlers associated with different keys.
middleware.use({

	open: (next) => { ... },
	
	close: (next) => { ... },
	
	process: (value, next) => { ... }

});
```

```js
// You can add multiple layers in different ways

const layer1 = (value, next) => ...;
const layer2 = (value, next) => ...;

// Option 1: Separate arguments
middleware.use(layer1, layer2);

// Option 2: Using an array
middleware.use([layer1, layer2]);

// Option 3: Calling `use` mutliple times in a chain
middleware.use(layer1).use(layer2);
```
 
#### `MiddlewareManager.apply(values, [handler])`

Apply a list of values to layers not associated with a key. Layers will be invoked based on the order they were added to the manager. 

An optinal final handler can be supplied that will be called at the end.

All layers will be given an additional `next` argument that is used to pass along values to the next layer.

The number of values you supply to `apply` can any number including no values.

```js
// A single value will be supplied to each layer
middleware.apply([value])

// Two values will be supplied to each layer and a final handler
middleware.apply([request, response], (request, response) => ...);
```

#### `MiddlewareManager.applyForKey(key, values, [handler])`

Apply a list of values to layers that have a handler associated with a given key. Layers will be invoked based on the order they were added to the manager. If a layer does not have a handler associated with a given key, the layer is simply skipped.

An optional final handler can be supplied that wil be called at the end.

Each layer handler associated with a key will be given an additional `next` argument that is used to pass along values to the next layer.

The number of values you supply to `applyForKey` can be any number including no values.

```js
// A single value will be supplied to each layer
middleware.applyForKey('process', [value])

// Two values will be supplied to each layer and a final handler
middleware.apply('route', [request, response], (request, response) => ...);
```

### License

MIT
