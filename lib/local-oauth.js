'use strict';
var oauthLib = require('oauth');

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
}

exports.oauth = class Oauthlocal{
    constructor(info, window){
        this.info = info;
        this.window = window;
        this.oauth = new oauthLib.OAuth(this.info.request_token, this.info.access_token, this.info.key, this.info.secret, this.info.version, this.info.callback, this.info.signature_method);
    }
    connect(){
        var that=this;
        return new Promise(function(resolve,reject){
            console.log("connecting");
            that.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                if (error){
                  reject(error);
                  return;
                }
                else{
                    that.oauth_token = oauth_token;
                    that.oauth_token_secret = oauth_token_secret;
                    resolve();
                    return;
                }
            });
            console.log("connected");
        });
    }

    tryGetID()
    {
        var that=this;
        return new Promise(function(resolve,reject){
            console.log("getting ID");
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
                     resolve();
                     return;
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
                return;
            });
            that.window.webContents.on('will-navigate', function (event, url) {
                console.log(url);
                var matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/);
                that.oauth.getOAuthAccessToken(that.oauth_token, that.oauth_token_secret, matched[2], function (error, oauth_access_token, oauth_access_token_secret) {
                    if (error)
                      reject(error);
                    else
                        resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
                    return;
                });
                event.preventDefault();
            });
            that.window.loadURL(url);
        });
    }

    login(){
        var that=this;
        return new Promise(function(resolve,reject){

            var oauth = new oauthLib.OAuth(that.info.request_token, that.info.access_token, that.info.key, that.info.secret, that.info.version, that.info.callback, that.info.signature_method);

            oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                if (error){
                  reject(error);
                  return;
                }
                  oauth.get(that.info.credential_url,
                           oauth_token,
                           oauth_token_secret,
                           function (error, response, result) {
                               if (error) {
                                   console.log(error);
                               }
                               try {
                                   console.log(JSON.parse(response));
                               } catch (parseError) {
                                   console.log(parseError);
                               }
                               console.log(response);
                               resolve();
                               return;
                           });

                var url = that.info.authorization_url + oauth_token;
                that.window.webContents.on('will-navigate', function (event, url) {
                    var matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/);
                    oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, matched[2], function (error, oauth_access_token, oauth_access_token_secret) {
                        if (error)
                          reject(error);
                        else
                            resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
                    });
                    event.preventDefault();
                });
                that.window.loadURL(url);
            });
        });
    }
}
