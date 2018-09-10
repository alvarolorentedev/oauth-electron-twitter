const {app, BrowserWindow} = require('electron'),
    auth = require('../../../index')
  
  function createWindow () {
    let info = {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET
    },
    window = new BrowserWindow()
    auth.login(info, window)
      .then((_) =>  window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`))
      .catch((_) => window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`))
  }
  
  app.on('ready', createWindow)