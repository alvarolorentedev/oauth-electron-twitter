'use strict';
var oauthLib = require('oauth');
var queryString = require('query-string');

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

exports.twitter = class twitteroauthInfo extends oauthInfo{
    constructor(key, secret){
        super();
        this.key =key;
        this.secret = secret;
        this.authorization_url = "https://api.twitter.com/oauth/authenticate?oauth_token=";
        this.credential_url = "https://api.twitter.com/1.1/account/verify_credentials.json";
        this.request_token = "https://api.twitter.com/oauth/request_token";
        this.access_token = "https://api.twitter.com/oauth/access_token";
        this.version = "1.0A";
        this.callback = null;
        this.signature_method= "HMAC-SHA1";
    }
};

exports.oauth = class Oauthlocal{
    constructor(info, window){
        this.oauth_token = "";
        this.oauth_token_secret = "";
        this.info = info;
        this.window = window;
        this.oauth = new oauthLib.OAuth(this.info.request_token, this.info.access_token, this.info.key, this.info.secret, this.info.version, this.info.callback, this.info.signature_method);
    }
    connect(){
        var that=this;
        return new Promise(function(resolve,reject){
            that.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                if (error){
                    reject(error);
                }
                else{
                    that.oauth_token = oauth_token;
                    that.oauth_token_secret = oauth_token_secret;
                    resolve();
                }
            });
        });
    }

    tryGetID()
    {
        var that=this;
        return new Promise(function(resolve,reject){
        that.oauth.get(that.info.credential_url,
                 that.oauth_token,
                 that.oauth_token_secret,
                 function (error, response, result) {
                     if (error) {
                         reject(error);
                         return;
                     }
                     try {
                         console.log(JSON.parse(response));
                     } catch (parseError) {
                         reject(parseError);
                         return;
                     }
                     console.log(response);
                     that.window.webContents.send('close');
                     resolve();
                 });
             });
    }

    askLogin()
    {
        var that=this;
        return new Promise(function(resolve,reject){
            var url = that.info.authorization_url + that.oauth_token;
            that.window.webContents.on('close', function(){
                reject('closed window');
            });
            that.window.webContents.on('will-navigate', function (event, url) {
                var parsed = queryString.parse(url);
                that.oauth.getOAuthAccessToken(that.oauth_token, that.oauth_token_secret, parsed.oauth_verifier, function (error, oauth_access_token, oauth_access_token_secret) {
                    console.log("holaaa");
                    if (error)
                        reject(error);
                    else
                        resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
                });
                event.preventDefault();
            });
            that.window.loadURL(url);
        });
    }
};
