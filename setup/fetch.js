const Twitter = require('twitter')
const superagent = require('superagent')
const conf = require('../config/twitter.js')
require('dotenv').config()

const getBearerToken = (key, secret) => {
  const encoded = new Buffer(`${key}:${secret}`).toString('base64')
  console.log(encoded)
  return superagent.post(conf.authUrl)
    .set('Authorization', `Basic ${encoded}`)
    .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
    .send('grant_type=client_credentials')
}

// ONLY USE IF BEARER TOKEN HAS BEEN INVALIDATED FOR SOME REASON
const initClient = () => {
  const { CONSUMER_KEY, CONSUMER_SECRET } = process.env
  getBearerToken(CONSUMER_KEY, CONSUMER_SECRET)
    .then(({ body }) => {
      return new Twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        bearer_token: body.access_token
      })
    })
}

const getClientFromEnv = () => {
  const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN } = process.env
  return new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    bearer_token: ACCESS_TOKEN
  })
}
