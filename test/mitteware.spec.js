import { mitte } from '../src/index';

describe('createMitteware', () => {

    it('exposes public API', () => {
        const manager = mitte();

        expect(manager.use).toBeDefined();
        expect(manager.run).toBeDefined();
        expect(manager.runForKey).toBeDefined();
    });

});
