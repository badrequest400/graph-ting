const Language = require('@google-cloud/language');

// Your Google Cloud Platform project ID
// Instantiates a client
const languageClient = Language({
  projectId: 'splitguru-154114',
  keyFilename: './keyfile.json'
});

// The text to analyze
const text = 'Hello, world!';

// Detects the sentiment of the text
languageClient.detectSentiment(text)
  .then((results) => {
    const sentiment = results[0];

    console.log(`Text: ${text}`);
    console.log(`Sentiment: ${sentiment}`);
  })
