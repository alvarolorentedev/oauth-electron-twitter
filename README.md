# ![logo](https://cloud.githubusercontent.com/assets/3071208/14719944/55c32866-07ff-11e6-9821-1a564a0cf065.png)

[![Build Status](https://travis-ci.org/kanekotic/oauth-electron-twitter.svg?branch=master)](https://travis-ci.org/kanekotic/oauth-electron-twitter)
[![codecov](https://codecov.io/gh/kanekotic/oauth-electron-twitter/branch/master/graph/badge.svg)](https://codecov.io/gh/kanekotic/oauth-electron-twitter)
[![npm](https://img.shields.io/npm/dy/oauth-electron-twitter.svg)](https://github.com/kanekotic/oauth-electron-twitter)
[![GitHub license](https://img.shields.io/github/license/kanekotic/oauth-electron-twitter.svg)](https://github.com/kanekotic/oauth-electron-twitter/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/kanekotic/oauth-electron-twitter/graphs/commit-activity)

Use Twitter OAuth in a simple way inside your electron App.

## Installation

add it to your electron project using `npm install oauth-electron-twitter --save` or `yarn add oauth-electron-twitter`

## Usage

require `oauth-electron-twitter` exports a function that requires a javascript object and an electron window, as seen on the next example:

add the require for ouath and twitter specific code from this package
```js
const auth = require(`oauth-electron-twitter`)

let info = {
    key: ***,
    secret: ***
},
window = new BrowserWindow({webPreferences: {nodeIntegration: false}});

auth.login(info, window)
```
the login function will return a Promise with the access token and secret

```
{
    token: ***,
    tokenSecret: ***
}
```

## Migration V0.x to V1.x

- there is no more need for the twitter object, info becomes a basic object with the properties stated in the usage step.
- the return object has a different format.

###### logo: Award graphic by <a href="http://www.freepik.com/">Freepik</a> and Twitter graphic by <a href="http://www.icomoon.io">Icomoon</a> from <a href="http://www.flaticon.com/">Flaticon</a> are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made and modified with <a href="http://logomakr.com" title="Logo Maker">Logo Maker </a>
