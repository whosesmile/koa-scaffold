## ![logo](https://avatars1.githubusercontent.com/u/1303816?v=2&u=c153ce09f7ba68a3c3eff36d876638a224db35da&s=30) koa-scaffold ![npm](https://badge.fury.io/js/koa-scaffold.png)

A koa scaffold with a well organize structure for build large application.

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
Think folder is a module of your app, and route has a like name. for example:
you should manage account of user, then you create a folder account, and in account/routes.js,
you def /account/profile as user's profile, /account/login and /account/logout for login and logout


### Routes autowire
In app.js, all routes.js (all routes should be defined in) is autowired recursive.


### About static file
I strongly suggest you should has a single static project and serve it use a web service such as nginx,
in this scoffold, it support serve static files by use koa-static-cache, you can rapidly develop at beginning.


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