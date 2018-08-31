jest.mock('oauth', () =>({
    OAuth: jest.fn()
}))
jest.mock('query-string', () => jest.fn())

const Oauth = require('../../../lib/oauth'),
    OAuth1 = require('oauth').OAuth,
    faker = require('faker'),
    queryString = require('query-string')

describe('oauth should', () => {
    test('construct using library', async () => {
        let info = { 
                key: faker.random.uuid(),
                secret: faker.random.uuid(),
                requestToken: faker.random.uuid(),
                accessToken: faker.random.uuid(),
            },
            expectedResult = { some: faker.random.uuid() }
            OAuth1.mockImplementation(() => expectedResult)

        let result = new Oauth(info)
        
        expect(OAuth1).toBeCalledWith(
            info.requestToken, 
            info.accessToken, 
            info.key,
            info.secret,
            "1.0A", 
            null, 
            "HMAC-SHA1")
        expect(result.oauth).toEqual(expectedResult)
        expect(result.info).toEqual(info)

    })

    test('getRequestTokens returns tokens', async () => {
        let token = faker.random.uuid(),
            tokenSecret = faker.random.uuid()
        let oauthMockResult = { getOAuthRequestToken: jest.fn(cb => cb(undefined, token, tokenSecret)) }
        OAuth1.mockImplementation(() => oauthMockResult)
        let result = new Oauth({})
        let tokens = await result.getRequestTokens()
        expect(tokens).toEqual({ token,tokenSecret })
    })

    test('getRequestTokens returns rejection if error', async () => {
        let error = faker.random.uuid()
        let oauthMockResult = { getOAuthRequestToken: jest.fn(cb => cb(error, undefined, undefined)) }
        OAuth1.mockImplementation(() => oauthMockResult)
        let result = new Oauth({})
        expect(result.getRequestTokens()).rejects.toEqual(error)
    })

    test('getAuthTokens returns rejection if error', async () => {
        let request = {
            token: faker.random.uuid(),
            tokenSecret: faker.random.uuid()
        },
        resultTokens = {
            token: faker.random.uuid(),
            tokenSecret: faker.random.uuid()
        },
        url = faker.random.uuid(),
        query = {
            oauth_verifier: faker.random.uuid()
        }
        oauthMockResult = { getOAuthAccessToken: jest.fn((_,__, ___,cb) => cb(undefined, resultTokens.token, resultTokens.tokenSecret)) }
        
        queryString.mockReturnValue(query)
        OAuth1.mockImplementation(() => oauthMockResult)
        let result = new Oauth({})
        
        expect(await result.getAccessToken(url, request)).toEqual(resultTokens)
        expect(oauthMockResult.getOAuthAccessToken).toBeCalledWith(request.token, request.tokenSecret, query.oauth_verifier, expect.anything())
        expect(queryString).toBeCalledWith(url)
    })

    // get_auth_tokens(url){
    //     return new Promise((resolve,reject) => {
    //         var parsed = queryString.parse(url);
    //         this.oauth.getOAuthAccessToken(this.oauth_token, this.oauth_token_secret, parsed.oauth_verifier, (error, oauth_access_token, oauth_access_token_secret, results) => {
    //             if (error) {
    //                 reject(error);
    //             }
    //             else {
    //               resolve({ oauth_access_token: oauth_access_token, oauth_access_token_secret: oauth_access_token_secret});
    //             }
    //         });
    //     });
    // }
})
