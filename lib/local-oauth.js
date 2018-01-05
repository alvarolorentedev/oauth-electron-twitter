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

class oauth_local{
    constructor(info, window){
        this.oauth_token = "";
        this.oauth_token_secret = "";
        this.info = info;
        this.window = window;
        this.oauth = new oauthLib.OAuth(this.info.request_token, this.info.access_token, this.info.key, this.info.secret, this.info.version, this.info.callback, this.info.signature_method);
    }

    get_request_tokens(){
        return new Promise((resolve,reject) => {
            this.oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
                if (error){
                    reject(error);
                }
                else{
                    this.oauth_token = oauth_token;
                    this.oauth_token_secret = oauth_token_secret;
                    resolve();
                }
            });
        });
    }

    get_auth_tokens(url){
        return new Promise((resolve,reject) => {
            var parsed = queryString.parse(url);
            this.oauth.getOAuthAccessToken(this.oauth_token, this.oauth_token_secret, parsed.oauth_verifier, (error, oauth_access_token, oauth_access_token_secret, results) => {
                if (error) {
                    reject(error);
                }
                else {
                  resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
                }
            });
        });
    }
}

exports.oauth = class Oauth_export{

    constructor(){
    }

    login(info, window){
        return new Promise((resolve,reject) => {
            var localoauth = new oauth_local(info, window);
            var url = "";

            window.webContents.on('close', function(){
                reject('closed window');
            });

            window.webContents.on('will-navigate', function (event, url) {
                if (url.indexOf('oauth_token=') >= 0 && url.indexOf('oauth_verifier=') >= 0) {
                    localoauth.get_auth_tokens(url).then((result)=>{
                        resolve(result);
                    }).catch(()=>{
                        window.show();
                        localoauth.get_auth_tokens(url).then((result)=>{
                            resolve(result);
                        }).catch((error)=>{
                            console.log('failing here')
                            reject(error);
                        });
                    });
                }
            });

            localoauth.get_request_tokens().then(()=>{
                url = localoauth.info.authorization_url + localoauth.oauth_token;
                window.loadURL(url);
            }).catch((error) => {reject(error);});

        });
    }
};
