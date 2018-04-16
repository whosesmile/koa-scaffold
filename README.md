## ![logo](https://avatars1.githubusercontent.com/u/1303816?v=2&u=c153ce09f7ba68a3c3eff36d876638a224db35da&s=30) koa-seed

A koa seed for build web mvc application rapidly with a carefully designed structure.

### Installation
````
$ git clone https://github.com/whosesmile/koa-seed
$ yarn install
````

### Quick develop
You should create a file named *.env* in the root dir like this:
```javascript
NODE_ENV=development
CLUSTER_COUNT=1
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
HTTP_PORT=3000
SECRET_KEYS=["nhiWHZ234zvrF2Wh5OiTXPL+OPdp/RnYKQj57e4kFr8="]
STATIC_PREFIX=/static/
LOG_DIR=./logs
```
then run:

````javascript
$ yarn start
````

### Structure
The application is composed by modules, every folder in app folder is treated as a module. routes.js in modules is the place for def routers, for example:

### Routes
you design pages for your users, you can create a folder named account as a module, and create file routes.js in account for routes,
now you can def "/account/profile" for user's profile page, "/account/login" and "/account/logout" for user login and logout and so on...

### Static files
koa-seed support serve static files by use koa-send for rapidly develop,
you can change serve folder and static prefix in app/config/index.js, But I strongly suggest you should has a single static project and serve it use a web service such as nginx.

### Templates
I use [nunjuncks](https://mozilla.github.io/nunjucks/) as template enegin

### ORM and Database
````
TODO
````
### Form and validation
````
TODO
````
### memcache or redis
````
TODO

### Test
````
TODO
````
### and so on...
````
TODO
````