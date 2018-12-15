# kryfe-tools

为前端脚手架项目kryfe-boilerplate，提供常用命令。

## 版本

1.4.x: 非nodejs部署版本，使用的是master分支。

1.5.x: nodejs部署试验版本，不断更新中，使用的是nodejs分支。

## 可配置环境变量

1. HOST：设置本地webpackServer运行地址，默认为localhost。
2. PORT：设置本地webpackServer运行端口，默认3000。
3. HOST_API：设置API接口地址；用于dev、test、prod环境。
4. HOST_CDN：设置静态文件存在地址，例如js、css、图片等；用于dev、test、prod环境。
5. HTTPS：是否启用https，默认值false。

## kryfe-script命令

常用命令包括：start、prod、build、release、analyzer, intl。

```
npm start

npm run prod

npm run build

npm run release

npm run analyzer

npm run intl

npm run intl:upload
```

**start**：启动本地webpackServer，用于模拟开发调试环境。

**prod**：启动本地webpackServer，用于模式生产环境。

build：打包测试环境代码，包含console的log、warn和error信息，用于bug调试。配合jenkins的test、citest环境。

release：打包正式边境代码，不包含任何console信息。配合jenkins的正式环境。

analyzer：代码打包分析命令。

intl: 生成多语言相关文件。

npm run intl:upload 向公共业务组上传生成的多语言文件(相关参数示例：SERVICE=(项目名/supply-ui/...) ENV=(citest/gb/online))

## kryfe-cmd 命令

提供的命令包括：module。

module：按照制定名字创建模块，模块下面包含components、actions、reducers、api等文件夹。同时会为其创建相应的测试目录。

项目中需要先运行link命令，将cmd命令进行注册。

```
npm link
```

创建模块的命令实例如下：

```
cmd module -n module1
```

**cmd**：为kryfe-cmd的缩写，表示命令集；

**module**：是具体命令，表示创建模块；

**-n**：为参数，-name的缩写，代表模块名字参数；

**module1**：需要创建的模块名字。
