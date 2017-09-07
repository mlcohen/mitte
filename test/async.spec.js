import { createMiddleware } from '../src/index';

describe.only('async', () => {

    describe('#applyAsync', () => {

        it('will do stuff', () => {
            const middleware = createMiddleware();

            middleware.use((v1, v2, next) => {
                next(`${v1} a`, `${v2} a`);
            });

            middleware.use((v1, v2, next) => {
                next(`${v1} b`, `${v2} b`);
            });

            return middleware.applyAsync(['test1', 'test2'])
                .then(result => {
                    expect(result).to.have.lengthOf(2);
                    expect(result[0]).to.equal('test1 a b');
                    expect(result[1]).to.equal('test2 a b');

                    return 'finish';
                })
                .then(result => {
                    expect(result).to.equal('finish');
                })
        });

    });

    describe('#applyForKeyAsync', () => {

        it('XXX', () => {

            const middleware = createMiddleware();

            middleware.use({
                foo: (v1, v2, next) => next(`${v1} a`, `${v2} a`),
                bar: (v1, v2, next) => next(`${v1} x`, `${v2} x`)
            });

            middleware.use({
                foo: (v1, v2, next) => next(`${v1} b`, `${v2} b`),
                bar: (v1, v2, next) => next(`${v1} y`, `${v2} y`)
            });

            return middleware.applyForKeyAsync('foo', ['test1', 'test2'])
                .then(result => {
                    expect(result).to.have.lengthOf(2);
                    expect(result[0]).to.equal('test1 a b');
                    expect(result[1]).to.equal('test2 a b');

                    return middleware.applyForKeyAsync('bar', ['test3', 'test4'])
                })
                .then(result => {
                    expect(result).to.have.lengthOf(2);
                    expect(result[0]).to.equal('test3 x y');
                    expect(result[1]).to.equal('test4 x y');

                    return 'finish';
                })
                .then(result => {
                    expect(result).to.equal('finish');
                });
        });

    });

});
