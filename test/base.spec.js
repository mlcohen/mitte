import { createMiddleware } from '../src/index';
import isFunction from 'lodash/isFunction';

describe('base', function () {

    it('Exposes public API', () => {
        const middleware = createMiddleware();

        expect(isFunction(middleware.use)).to.be.true;
        expect(isFunction(middleware.apply)).to.be.true;
        expect(isFunction(middleware.applyAsync)).to.be.true;
        expect(isFunction(middleware.applyForKey)).to.be.true;
        expect(isFunction(middleware.applyForKeyAsync)).to.be.true;
    });

    it('Creates new middleware instances', () => {
        const instance1 = createMiddleware();
        const instance2 = createMiddleware();

        expect(instance1).to.not.equal(instance2);
    });

});
