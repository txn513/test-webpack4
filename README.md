# 如何开始
```
 软件包: \\192.18.1.251\tools\dev\HtmlIde
 npm: 在cmd或bash下运行

```


1. 安装nodejs
2. 配置nodejs
  * 自定义存储位置(如:D:\nodejs)  
     npm config set prefix "D:\nodejs\node_global"  
     npm config set cache "D:\nodejs\node_cache"   
     添加操作系统环境变量: 名: NODE_PATH 值: D:\nodejs\node_global\node_modules
  * 配成国内下载地址(解决下载慢):  
     阿里: npm config set registry http://registry.npm.taobao.org
3. 相关命令(切换至程序根目录)
``` 
    # 安装组件包
      npm install

    # 更新组件包
      npm update

    # 开发运行(serve with hot reload at localhost:8080)
      npm run dev

    # 测试打包
      npm run test

    # 发布打包
      npm run build
    
```
4. 安装开发IDE - WebStorm(推荐)
# 文件目录
* build - webpack打包配置文件
* config - 环境配置文件
* dist - 打包文件
* src - 源码文件
    * api - 调用接口地址
    * assets -  静态文件
    * common - 公用文件(公用函数,多语言参数配置等)
    * components - 自定义vue组件
    * mock - 模拟接口返回
    * styles - 公用样式
    * views - 页面
    * vuex - vue缓存
    * app.vue - 页面入口
    * demoMenu.js - 演示菜单
    * element-variables.scss - 样式主题
    * global.js - 全局变量
    * i18n.js - 多语言配置
    * main.js - 加载入口
    * router.js - 路由配置（引用与全局)
    * routes.js - 路由配置（各页面）
* static - 不参与编译打包的静态文件(对应的打包后生成的static目录,打包前后文件名不变化)
* README-modify.md 版本发布记录

#开发说明
* 声明的全局变量在各环境下(开发、测试、发布等)是使用不同的值的,请在config/dev.env.js 与 config/prod.env.js中进行配置.


# 相关资料
* vue: https://cn.vuejs.org/
* vue document: https://cn.vuejs.org/v2/guide/
* vue-cli: https://github.com/vuejs/vue-cli
* element: http://element-cn.eleme.io/#/zh-CN
* element component: http://element-cn.eleme.io/#/zh-CN/component/installation
* element theme: https://elementui.github.io/theme-chalk-preview/#/zh-CN
