// 项目发布阶段需要用到的 babel  插件
const prodPlugins = []
// 判断编译模式
if(process.env.NODE_ENV === 'production'){
  // 发布模式
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // ...展开运算符  发布产品用到的数组
    ...prodPlugins
  ]
}
