module.exports = {
  pwa: {
    themeColor: '#151C4F',
    name: 'Hobbyfiguras',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  runtimeCompiler: true
}
