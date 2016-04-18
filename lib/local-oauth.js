'use strict';
var oauth = require('oauth');

class oauthInfo{
    constructor(){
        this.key ="";
        this.secret = "";
        this.window = "";
        this.url = "";
        this.request_token = "";
        this.access_token = "";
        this.version = "";
        this.callback = "";
        this.signature_method= "";
    }
}

class twitteroauthInfo extends oauthInfo{
    constructor(key, secret, window){
        this.key =key;
        this.secret = secret;
        this.window = window;
        this.url = "https://api.twitter.com/oauth/authenticate?oauth_token=";
        this.request_token = "https://api.twitter.com/oauth/request_token";
        this.access_token = "https://api.twitter.com/oauth/access_token";
        this.version = "1.0A";
        this.callback = null;
        this.signature_method= "HMAC-SHA1";
    }
}

class Oauthlocal{
    constructor(info){
        this.info = info;
    }

    login(){
        var return_promise = new Promise();
        var oauth = new oauth.OAuth(this.info.request_token, this.info.access_token, this.info.key, this.info.secret, this.info.version, this.info.callback, this.info.signature_method);

        oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
            if (error)
              return_promise.reject(error);

            var url = this.info.url + oauth_token;
            this.window.webContents.on('will-navigate', function (event, url) {
                var matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/);
                oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, matched[2], function (error, oauth_access_token, oauth_access_token_secret) {
                    if (error)
                      return_promise.reject(error);
                    else
                        return_promise.resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
                });
                event.preventDefault();
            });
            this.window.loadURL(url);
        });
        return return_promise;
    }
}
