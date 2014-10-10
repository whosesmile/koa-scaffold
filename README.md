## ![logo](https://avatars1.githubusercontent.com/u/1303816?v=2&u=c153ce09f7ba68a3c3eff36d876638a224db35da&s=30) koa-scaffold

A koa scaffold for build web mvc application rapidly with a carefully designed structure.

### Installation
````
$ git clone https://github.com/whosesmile/koa-scaffold
$ npm install
````

### Quick start

Aha, just input cmd:
````
$ node --harmony server.js
````

I strongly suggest you install [node-supervisor](https://github.com/isaacs/node-supervisor), and input cmd:
````
$ supervisor --harmony -w app server.js
````

### Structure
The application is composed by modules, every folder in app folder is treated as a module. routes.js in modules is the place for def routers, for example:
you design pages for your users, you can create a folder named account as a module, and create file routes.js in account for routes,
now you can def "/account/profile" for user's profile page, "/account/login" and "/account/logout" for user login and logout and so on...


### Routes
In app.js, all routes.js (all routes should be defined in) is autowired recursive, it means you just write your routes,
dont need care require in app.js, but it's no order and all routes.js is autowired, if you not want to that, change it youself in app.js.


### Static files
koa-scaffold support serve static files by use [koa-static-cache](https://github.com/koajs/static-cache) for rapidly develop, 
you can change serve folder and static prefix in app/common/config.js, But I strongly suggest you should has a single static project and serve it use a web service such as nginx.


### Templates
I use [swig](https://github.com/paularmstrong/swig) as template enegin

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