const Language = require('@google-cloud/language');
const path = require('path')

// Your Google Cloud Platform project ID
// Instantiates a client
const languageClient = Language({
  projectId: 'splitguru-154114',
  keyFilename: path.resolve(__dirname, './keyfile.json')
});

// Detects the sentiment of the text
const getSentiment = (text) => {
  return languageClient.detectSentiment(text)
}

const getTweetSentiment = (tweet) => {
  return getSentiment(tweet.text)
    .then((res) => {
      return { ...tweet, sentiment: res[1],  }
    })
}

module.exports = {
  getSentiment,
  getTweetSentiment
}
