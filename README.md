## ![logo](https://avatars1.githubusercontent.com/u/1303816?v=2&u=c153ce09f7ba68a3c3eff36d876638a224db35da&s=30) koa-scaffold !

A koa scaffold for build application rapidly with a carefully designed folder structure.

### Installation
````
$ git clone https://github.com/whosesmile/koa-scaffold
$ npm install
````

### Quick start

Aha, just input cmd:
````
$ node --harmony app.js
````

### Folder structure
the app is composed by modules, every folder in app is a module. route.js in modules is routes defination for mvc, for example:
you design manage your account of users, you should create a folder account as a module, and create file routes.js for routes,
now you can def "/account/profile" for user's profile page, "/account/login" and "/account/logout" for user login and logout and so on...


### Routes autowire
In app.js, all routes.js (all routes should be defined in) is autowired recursive, it means you just write your routes,
dont need care require in app, but it's no order and all routes.js is autowired, if you dont want to, change it youself in app.js.


### About static file
it support serve static files by use [koa-static-cache](https://github.com/koajs/static-cache) for rapidly develop, 
you can change serve folder and static prefix in app/common/config.js, But I strongly suggest you should has a single static project and serve it use a web service such as nginx,


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
````


### Test
````
TODO Aha, I`m not test driver...
````

### and so on...
````
TODO
````