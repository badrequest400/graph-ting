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

const client = getClientFromEnv()

const getQuery = (client, keyword) => {
  return new Promise((resolve, reject) => {
    client.get('search/tweets', { q: keyword }, (err, tweets, res) => {
      const { statuses } = tweets
      const tagQuery = tag(keyword)
      resolve(statuses.map(tagQuery))
    })
  })
}
const getUser = (client, id, tag) => {
  return new Promise((resolve, reject) => {
    client.get('users/lookup', { user_id: id }, (err, users, res) => {
      resolve(users.map((user) => ({ ...user, tag })))
    })
  })
}
const getFriends = (client, id) => {
  return new Promise((resolve, reject) => {
    client.get('search/tweets', { user_id: id }, (err, users, res) => {
      resolve(users)
    })
  })
}
/// GET LAST 20 FAVOURITED THINGS FOR USER
const getFavourites = (client, id) => {
  return new Promise((resolve, reject) => {
    client.get('favorites/list', { user_id: id }, (err, tweets, res) => {
      resolve(tweets)
    })
  })
}

const tag = (keyword) => (entity) => ({ ...entity, tag: keyword })

module.exports = {
  client,
  getQuery,
  getFriends,
  getFavourites,
  getUser
}
