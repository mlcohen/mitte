import { createMiddleware } from '../src/index';
import isFunction from 'lodash/isFunction';

describe('mitte', function () {

    it('Exposes public API', () => {
        const middleware = createMiddleware();

        expect(isFunction(middleware.use)).to.be.true;
        expect(isFunction(middleware.apply)).to.be.true;
        expect(isFunction(middleware.applyForKey)).to.be.true;
    });

    it('Creates new middleware instances', () => {
        const instance1 = createMiddleware();
        const instance2 = createMiddleware();

        expect(instance1).to.not.equal(instance2);
    });

    describe('With no middleware layers', () => {

        it('will not throw errors when apply methods are called', () => {
            const middleware = createMiddleware();
            
            middleware.apply(['foo', 'bar']);
            middleware.applyForKey('test', ['foo', 'bar']);

            const handler = sinon.spy();

            middleware.apply(['a', 'b'], handler);

            expect(handler).to.have.been.calledOnce;
            expect(handler).to.have.been.calledWithExactly('a', 'b');

            middleware.applyForKey('test', ['c', 'd'], handler);

            expect(handler).to.have.been.calledTwice;
            expect(handler).to.have.been.calledWithExactly('c', 'd');
        });

    });

    describe('#apply', () => {

        it('will apply a single value to all layers and the final handler', () => {
            const middleware1 = createMiddleware();
            const middleware2 = createMiddleware();
            const middleware3 = createMiddleware();

            const layer1 = sinon.spy((value, next) => next(`a ${value}`));
            const layer2 = sinon.spy((value, next) => next(`b ${value}`));

            middleware1.use([layer1, layer2]);
            middleware2.use(layer1, layer2);
            middleware3.use(layer1).use(layer2);

            const middlewareList = [middleware1, middleware2, middleware3];

            middlewareList.forEach(middleware => {
                middleware.apply(['test1'], value => {
                    expect(value).to.equal('b a test1');
                });

                middleware.apply(['test2'], value => {
                    expect(value).to.equal('b a test2');
                });
            });

            expect(layer1).to.have.callCount(6);
            expect(layer2).to.have.callCount(6);
        });

        it('will apply multiple values to all layers and the final handler', () => {
            const middleware1 = createMiddleware();
            const middleware2 = createMiddleware();
            const middleware3 = createMiddleware();

            const layer1 = sinon.spy((val1, val2, next) => next(`a ${val1}`, `b ${val2}`));
            const layer2 = sinon.spy((val1, val2, next) => next(`x ${val1}`, `y ${val2}`));

            middleware1.use([layer1, layer2]);
            middleware2.use(layer1, layer2);
            middleware3.use(layer1).use(layer2);

            const middlewareList = [middleware1, middleware2, middleware3];

            middlewareList.forEach(middleware => {
                middleware.apply(['test1-1', 'test1-2'], (val1, val2) => {
                    expect(val1).to.equal('x a test1-1');
                    expect(val2).to.equal('y b test1-2');
                });

                middleware.apply(['test2-1', 'test2-2'], (val1, val2) => {
                    expect(val1).to.equal('x a test2-1');
                    expect(val2).to.equal('y b test2-2');
                });
            });

            expect(layer1).to.have.callCount(6);
            expect(layer2).to.have.callCount(6);
        });

    });

    describe('#applyForKey', () => {

        it('will apply values to all layers and the final handler for a given key', () => {
            const middleware1 = createMiddleware();
            const middleware2 = createMiddleware();
            const middleware3 = createMiddleware();

            const layer1 = {
                foo: sinon.spy((value, next) => next(`a ${value}`)),
                baz: sinon.spy((val1, val2, next) => next(`x ${val1}`, `x ${val2}`))
            };

            const layer2 = {
                bar: sinon.spy((value, next) => next(`b ${value}`))
            };

            const layer3 = {
                foo: sinon.spy((value, next) => next(`c ${value}`)),
                bar: sinon.spy((value, next) => next(`d ${value}`))
            };

            const layer4 = {
                baz: sinon.spy((val1, val2, next) => next(`y ${val1}`, `y ${val2}`))
            };

            middleware1.use([layer1, layer2, layer3, layer4]);
            middleware2.use(layer1, layer2, layer3, layer4);
            middleware3.use(layer1).use(layer2).use(layer3).use(layer4);

            const middlewareList = [middleware1, middleware2, middleware3];

            middlewareList.forEach(middleware => {
                middleware.applyForKey('foo', ['test1'], value => {
                    expect(value).to.equal('c a test1');
                });

                middleware.applyForKey('foo', ['test2'], value => {
                    expect(value).to.equal('c a test2');
                });

                middleware.applyForKey('bar', ['test1'], value => {
                    expect(value).to.equal('d b test1');
                });

                middleware.applyForKey('bar', ['test2'], value => {
                    expect(value).to.equal('d b test2');
                });

                middleware.applyForKey('baz', ['test1-1', 'test1-2'], (val1, val2) => {
                    expect(val1).to.equal('y x test1-1');
                    expect(val2).to.equal('y x test1-2');
                });

                middleware.applyForKey('baz', ['test2-1', 'test2-2'], (val1, val2) => {
                    expect(val1).to.equal('y x test2-1');
                    expect(val2).to.equal('y x test2-2');
                });
            });

            expect(layer1.foo).to.have.callCount(6);
            expect(layer1.baz).to.have.callCount(6);
            expect(layer2.bar).to.have.callCount(6);
            expect(layer3.foo).to.have.callCount(6);
            expect(layer3.bar).to.have.callCount(6);
            expect(layer4.baz).to.have.callCount(6);
        });

    });

    describe('Mixed layers with and with no keys', () => {

        it('will apply values to correct layers and final handler based on use of key or no key', () => {
            const layer1 = sinon.spy((value, next) => next(`a ${value}`));
            const layer2 = {
                foo: sinon.spy((value, next) => next(`b ${value}`))
            };
            const layer3 = sinon.spy((value, next) => next(`c ${value}`));
            const layer4 = {
                foo: sinon.spy((value, next) => next(`d ${value}`))
            };
            const layer5 = sinon.spy((value, next) => next(`e ${value}`));
            const layer6 = {
                bar: sinon.spy((value, next) => next(`f ${value}`))
            };

            const middleware1 = createMiddleware();
            const middleware2 = createMiddleware();
            const middleware3 = createMiddleware();

            middleware1.use(layer1, layer2, layer3, layer4, layer5, layer6);
            middleware2.use([layer1, layer2, layer3, layer4, layer5, layer6]);
            middleware3.use(layer1).use(layer2, layer3).use([layer4, layer5]).use(layer6);

            const middlewareList = [middleware1, middleware2, middleware3];

            middlewareList.forEach(middleware => {
                middleware.apply(['test1'], value => {
                    expect(value).to.equal('e c a test1');
                });

                middleware.apply(['test2'], value => {
                    expect(value).to.equal('e c a test2');
                });

                middleware.applyForKey('foo', ['test1'], value => {
                    expect(value).to.equal('d b test1');
                });

                middleware.applyForKey('foo', ['test2'], value => {
                    expect(value).to.equal('d b test2');
                });

                middleware.applyForKey('bar', ['test1'], value => {
                    expect(value).to.equal('f test1');
                });

                middleware.applyForKey('bar', ['test2'], value => {
                    expect(value).to.equal('f test2');
                });
            });

            expect(layer1).to.have.callCount(6);
            expect(layer2.foo).to.have.callCount(6);
            expect(layer3).to.have.callCount(6);
            expect(layer4.foo).to.have.callCount(6);
            expect(layer5).to.have.callCount(6);
            expect(layer6.bar).to.have.callCount(6);
        });

    });

});
