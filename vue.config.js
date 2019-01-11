module.exports = {
  pwa: {
    themeColor: '#151C4F',
    name: 'Hobbyfiguras',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map'
  }
}
