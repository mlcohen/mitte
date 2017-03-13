const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'mitte.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'mitte',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "babel-loader"
            }]
        }]
    }
}
