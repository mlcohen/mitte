import { mitte } from '../src/index';
import isFunction from 'lodash/isFunction';

describe('mitte', function () {

    it('exposes public API', function () {
        const manager = mitte();

        expect(isFunction(manager.use)).to.be.true;
        expect(isFunction(manager.run)).to.be.true;
        expect(isFunction(manager.runForKey)).to.be.true;
    });

});

describe('foo', function () {

    it('blah', function () {
        // const manager = mitte();

        // const middleware1 = jest.fn(next => next());
        // const middleware2 = jest.fn(next => next());

        // manager.use(middleware1);
        // manager.use(middleware2);

        // const handler = jest.fn();

        // manager.run(handler);

        // expect(middleware1).toHaveBeenCalledTimes(1);
        // expect(middleware2).toHaveBeenCalledTimes(1);
        // expect(handler).toHaveBeenCalledTimes(1);
    });

});
