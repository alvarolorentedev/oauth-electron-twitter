# ![logo](https://cloud.githubusercontent.com/assets/3071208/14719944/55c32866-07ff-11e6-9821-1a564a0cf065.png)


Use Twitter OAuth in a simple way inside your electron App.

## Usage

add the require for ouath and twitter specific code from this package

```js
var oauth = require('oauth-electron-twitter').oauth;
var twitter = require('oauth-electron-twitter').twitter;
```

declare a twitter object, and use it as parameter for the oauth in conjuntion with the electron window used to display the login
```js
var info = new twitter("key","secret");
var auth = new oauth();
auth.login(info, window);
```
the login function will return a Promise with the acces token and secret
```
{
    oauth_access_token: ***,
    oauth_access_token_secret: ***
}
```



###### logo: Award graphic by <a href="http://www.freepik.com/">Freepik</a> and Twitter graphic by <a href="http://www.icomoon.io">Icomoon</a> from <a href="http://www.flaticon.com/">Flaticon</a> are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made and modified with <a href="http://logomakr.com" title="Logo Maker">Logo Maker </a>
