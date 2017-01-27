require('babel-register')
const fs = require('fs')
const path = require('path')
const { getTweetSentiment } = require('../sentiment/index.js')

const getAllSentiments = (tweets) => {
  return Promise.all(tweets.map((tweet) => getTweetSentiment(tweet)))
}

const getAllTweetSentiments = (tweets) => {
  return getAllSentiments(tweets)
    .then((results) => {
      console.log(results)
      return results.reduce((acc, res) => acc.concat(res), [])
    })
    .catch((err) => console.log(err))
}



module.exports = {
  getAllTweetSentiments
}
