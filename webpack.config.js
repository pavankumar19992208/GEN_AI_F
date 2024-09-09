const path = require('path');

module.exports = {
  // Other Webpack configurations...
  module: {
    rules: [
      // Other rules...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/lottie-react/ // Exclude lottie-react from source map warnings
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};