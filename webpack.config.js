const webpack = require('webpack')

const useProd = config => 
  Object.assign({}, config, {
    mode: 'production',
  })

const useDev = config =>
  Object.assign({}, config, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })

const baseConfig = {
  mode: 'none',
  module: {
    rules: [{
      test: /\.js|jsx$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  resolve : {
    extensions : ['.js', '.jsx']
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports = useProd(baseConfig)
} else {
  module.exports = useDev(baseConfig)
}
