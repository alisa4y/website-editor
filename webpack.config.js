const transformer = require('ts-reflection/transformer').default;
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: "inline-source-map",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
        }, {
            test: /\.ts(x)?$/,
            loader: 'ts-loader', // Or 'awesome-typescript-loader'
            options: {
                getCustomTransformers: program => ({
                    before: [transformer(program)],
                }),
            },
            exclude: /node_modules/,
        }],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};