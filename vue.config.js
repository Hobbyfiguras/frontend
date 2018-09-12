module.exports = {
  chainWebpack: config => {
      config.plugin("pwa").tap(args => {
        return [pwaArgs];
      });
    },
  pwa: {
    themeColor: '#151C4F'
  }
}