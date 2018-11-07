module.exports = {
  chainWebpack: config => {
    config.plugin('pwa').tap(args => {
      return [args]
    })
  },
  pwa: {
    themeColor: '#151C4F'
  },
  runtimeCompiler: true
}
