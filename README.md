
## ![logo](https://avatars1.githubusercontent.com/u/1303816?v=2&u=c153ce09f7ba68a3c3eff36d876638a224db35da&s=30) koa-seed



## 简介
这是一个基于koa的web脚手架，预先定义了目录结构和一些必要的功能，你可以基于此快速开发你的应用。

## 安装
````
$ git clone https://github.com/whosesmile/koa-seed
$ cd koa-seed && yarn install
````

## 启动
首先需要做一些环境配置，譬如启动的端口，安全秘钥，静态前缀，日志目录等，这些设置在**.env**文件内。

> 注意：启动时通过命令行设置的环境变量将会覆盖此处的值。
> 注意：以下配置中，redis和qiniu是可选的：不设置redis即意味着不使用基于redis的session；不设置qiniu即意味着不使用上传图片服务。

```javascript
# ENVIROMENT
NODE_ENV=development

# HTTP
HTTP_PORT=3000
CLUSTER_COUNT=1

# STATIC FILES
STATIC_PREFIX=/static/

# LOGGER
LOG_DIR=./logs

# COOKIE SECRET
SECRET_KEYS=["some secret key"]

# REDIS (可选 即不使用redis session)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# QINIU UPLOAD (可选 即不使用上传服务)
QINIU_BUCKET="your storage"
QINIU_DOMAIN="your domain"
QINIU_ACCESS_KEY="some secret key"
QINIU_SECRET_KEY="some secret key"
```
然后运行:
````javascript
$  yarn start
````

## 结构
目录结构设计遵循了几个原则：
### 1. 根据业务划分目录，而不是根据功能。

#### 按功能拆分的坏处：
* 当工程规模扩张时，没有很好的目录约束，会导致相互无序的引用
* 当修改一个业务时，同时需要跨越多个层级的目录去查找修改文件
* 当引用文件时，需要使用../../../some...
```html
|----controlers
              |----account.js
              |----shopping.js
|----models
              |----user.js
              |----goods.js
              |----order.js
|----templates
              |----account.html
              |----shopping.html
```

#### 按业务内聚的好处：
* 业务相关文件内聚，天然规避无序引用
* 业务隔离，很好地插拔模块，便于下架或移植
* 便于维护
```html
|----account
              |----index.js
              |----routes.js
              |----service.js
              |----templates
                            |----profile.html
                            |----settings.html
|----shopping
              |----index.js
              |----routes.js
              |----service.js
              |----templates
                            |----goods.html
                            |----carts.html
                            |----orders.html
```

### 2. 约定严格限制跨模块引用
在业务的目录结构中约定：不允许跨越模块引用文件
```javascript
 // 在account目录内，禁止如下调用：
 import * as services from 'shopping/service.js';
```

> 在公共文件如utils、middleware等支撑目录，为了规避循环引用问题，可以不通过统一的utils/index.js对外暴露目录接口，而允许直接引用

### 3.  不允许依赖外部命令，即使用npm scripts执行脚本
为了保持程序的健壮，不要使用命令行直接编译、执行业务脚本，而是通过npm scripts或yarn来执行，保持相关脚本被内部依赖而不是全局安装。

## 静态文件
一般来说，建议工程上做动静分离，即Node只提供API，静态文件通过其他工程单独构建。
但是考虑到可能工程规模很小，没有必要额外拆分静态工程增加复杂度；或者工程不使用MVVM模式构建而是传统的服务端HTML编译方式，所以此处添加了静态文件的支持。
约定所有的静态文件都放置在**static**目录内，对外prefix可以通过.evn文件进行相关配置，默认值: */static/*

## 模板引擎
为了方便输出服务端html，工程内置了模板引擎 [nunjuncks](https://mozilla.github.io/nunjucks/) ，如果你希望使用其他引擎，可以自行更换。
为了保持工程简单性，并没有使用 [consolidate]
(https://github.com/tj/consolidate.js) 整合模板引擎，这个看你的喜好自行扩展。

## 表单验证
为了让路由层聚焦业务处理，工程实现了一个简单的中间件用于支撑 [Joi](https://github.com/hapijs/joi) ，用于于解耦路由层的参数验证。
目前可以支撑 body, query, params 单个参数的验证，可以自行扩展支撑其他请求参数的验证。

 ## 测试
jest
````
文档待完善
````

### and so on...
````
文档待完善
````
