var request = require('request');
var config = require('./config');
var spFN = require('./spFN');
var btoa = require('btoa');
var OAuth = require('OAuth');

logintwitterfn = {
    getAuthorization: function (req, res) {
        const consumerKey = config.TWITTER_CONSUMER_KEY,
            consumerSecret = config.TWITTER_CONSUMER_SECRET,
            accessToken = config.TWITTER_ACCESS_TOKEN,
            accessTokenSecret = config.TWITTER_ACCESS_TOKEN_SECRET;
        let httpMethod = 'POST';
        let reqParams = '';
        let baseUrl = 'https://api.twitter.com/oauth/request_token';
        // timestamp as unix epoch
        let timestamp = Math.round(Date.now() / 1000);
        // nonce as base64 encoded unique random string
        let nonce = btoa(consumerKey + ':' + timestamp);
        // generate signature from base string & signing key
        let baseString = spFN.oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
        let signingKey = spFN.oAuthSigningKey(consumerSecret, accessTokenSecret);
        let signature = spFN.oAuthSignature(baseString, signingKey);
        let finalheader = 'OAuth ' +
            'oauth_nonce="' + nonce + '",' +
            'oauth_signature_method="HMAC-SHA1",' +
            'oauth_timestamp="' + timestamp + '",' +
            'oauth_consumer_key="' + consumerKey + '",' +
            'oauth_signature="' + signature + '",' +
            'oauth_token="' + accessToken + '",' +
            'oauth_version="1.0"'
        request.post(baseUrl, { headers: { Authorization: finalheader } }, function (error, response, body) {
            if (error)
                console.log(error);
            else {
                res.json({ success: true, data: body });
            }

        })
    },
    getAccessToken: function (req, res) {
        var data = req.headers['authorization'];
        var baseUrl = 'https://api.twitter.com/oauth/access_token';
        request.get(baseUrl, { headers: { Authorization: data } }, function (error, response, body) {
            if (error)
                console.log(error);
            else {

                res.json({ success: true, data: body });
            }

        })
    },
    getUserTimeline: function (req, res) {
        var data = req.headers['authorization'];
        var strData = req.headers['authorization'].split('&');
        var screenName = strData[0];
        const consumerKey = config.TWITTER_CONSUMER_KEY,
        consumerSecret = config.TWITTER_CONSUMER_SECRET,
        accessToken = strData[1],
        accessTokenSecret = strData[2];
        // var baseUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json?' + screenName;
        var oauth = new OAuth.OAuth('https://api.twitter.com/oauth/request_token'
            , 'https://api.twitter.com/oauth/access_token'
            , consumerKey
            , consumerSecret
            , '1.0A'
            , null
            , 'HMAC-SHA1');

        oauth.get('https://api.twitter.com/1.1/statuses/user_timeline.json?' + screenName 
            , accessToken
            , accessTokenSecret
            , function (e, data, result) {
                if (e) console.error(e);
                res.json({success: true, data:JSON.parse(data)});
            });
    },

}


module.exports = logintwitterfn;
