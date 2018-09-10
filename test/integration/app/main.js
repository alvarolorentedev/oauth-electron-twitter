const {app, BrowserWindow} = require('electron'),
    auth = require('../../../index')
  
  function createWindow () {
    let info = {
        key: "Rh24sadwfFChzqf2fOv85Shg5",
        secret: "fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J",
    },
    window = new BrowserWindow()
    auth.login(info, window)
      .then((_) =>  window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`))
      .catch((_) => window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`))
  }
  
  app.on('ready', createWindow)