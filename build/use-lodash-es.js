// https://github.com/reactjs/redux/blob/master/build/use-lodash-es.js
module.exports = function () {
    return {
        visitor: {
            ImportDeclaration(path) {
                const source = path.node.source;
                source.value = source.value.replace(/^lodash($|\/)/, 'lodash-es$1');
            }
        }
    };
};
