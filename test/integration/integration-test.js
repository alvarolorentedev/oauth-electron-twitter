const Application = require('spectron').Application
const electronPath = require('electron'),
    path = require('path')

describe('oauth electron', () => {
    let app
    beforeEach(async () => {
        app = new Application({
            path: electronPath,
            args: [path.join(__dirname, './app/main.js')]
        })
        await app.start()
    }) 

    afterEach(async () => {
        if (app && app.isRunning())
            await app.stop()
    })

    it('should load electron app for twitter oauth', async () => {
        await app.client.setValue('#username_or_email', 'd2918123@nwytg.net')
        await app.client.setValue('#password', 'vanguard.dubbin.compete')
        await app.client.click('#allow') 
        await app.client.waitUntilTextExists('#result', 'Success')
    });
});