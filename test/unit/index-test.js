jest.mock('../../lib/login', () => jest.fn())
const login = require('../../lib/login'),
    index = require('../..')

describe('index should', () => {
    test('export login', async () => {
        expect(index.login).toBe(login)
    })
})