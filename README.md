# tools-for-react-app

一些关于 react 应用开发的工具集

## 可配置环境变量

在实际项目开发中，在 package.json 或者其他地方设置下面环境变量即可

1. HOST：设置本地 webpackServer 运行地址，默认为 localhost。
2. PORT：设置本地 webpackServer 运行端口，默认 3000。
3. HOST_API：设置 API 接口地址；用于 dev、test、prod 环境。
4. HOST_CDN：设置静态文件存在地址，例如 js、css、图片等；用于 dev、test、prod 环境。
5. HTTPS：是否启用 https，默认值 false。

## 常用的 script 命令

常用命令包括：start、prod、build、release、analyzer, intl。

```
npm start

npm run prod

npm run build

npm run release

npm run analyzer

npm run intl
```

**start**：启动本地 webpackServer，用于模拟开发调试环境。

**prod**：启动本地 webpackServer，用于模式生产环境。

**build**：打包测试环境代码，包含 console 的 log、warn 和 error 信息，用于 bug 调试。

**release**：打包正式边境代码，不包含任何 console 信息。

**analyzer**：代码打包分析命令。

**intl**: 生成多语言相关文件。
