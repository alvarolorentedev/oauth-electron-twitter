const Oauth = require('./oauth')

let _ = {
    requestTokens: {}
}

const bindWindowsEvents = (window, oauth) =>
    (resolve, reject) => {
        window.webContents.on('close', () => {
            reject('closed window')
        });
        window.webContents.on('will-navigate', (__, address) => {
            window.show()
            resolve(oauth.getAccessToken(address, _.requestTokens))
        })
    }

const login = (info, window) => {
    let oauth = new Oauth(info)
    let promise = new Promise(bindWindowsEvents(window, oauth))
    oauth.getRequestTokens().then(result => {
        _.requestTokens = result
        window.loadURL(`https://api.twitter.com/oauth/authenticate?oauth_token=${result.token}`)
    })
    return promise
}

module.exports = login