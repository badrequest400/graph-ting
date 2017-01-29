require('babel-register')
const neo4j = require('neo4j-driver').v1
const users = require('../data/users.json')
const tweets = require('../data/queries.json')

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"))
const session = driver.session()

const queries = [
  'CREATE (topshop:Query {tag: "topshop"})',
  'CREATE (lfw17:Query {tag: "lfw17"})',
  'CREATE (ivypark:Query {tag: "ivypark"})'
]

const runQuery = (query) => {
  session.run(query).then(() => {
    session.close()
    driver.close()
  })
}


const loadQueries = (queries) => {
  queries.forEach(runQuery)
}

const loadTweets = (tweets) => {
  const tweetQuery = `CREATE (${id}:Tweet {tag: "${tag}", documentScore: "${score}", documentMagnitude: "${magnitude}", text: '${text}', created_at: '${created_at}' })`
  tweets.forEach((
    {
      id,
      created_at,
      text,
      sentiment: { documentSentiment: { score, magnitude } },
       tag
    }) => runQuery(tweetQuery))
}

const loadUsers = (users) => {
  const userQuery = `CREATE (${id}:User {name: "${name}", screenName: "${screen_name}", location: "${location}", followers: "${followers_count}", friends: "${friends_count}"})`
  users.forEach((
    {
      id,
      name,
      screen_name,
      location,
      followers_count,
      friends_count
    }) => runQuery(userQuery))
}

const tweetToQuery = (tweets) => {
  const relation = `CREATE (${id})-[:KEYWORD_OF { created_at: ${created_at} }]->(${tag})`
  tweets.forEach(({ id, created_at, tag }) => runQuery(relation))
}

const userToQuery = (users) => {
  const relation = `CREATE (${id})-[:TWEETED_WITH_KEYWORD]->(${tag})`
  users.forEach(({ id, tag }) => runQuery(relation))
}

const userToTweet = (users, tweets) => {
  const relation = `CREATE (${id})-[:TWEETED { created_at: ${created_at} }]->(${tweetId})`
  users.forEach(({ id }) => {
    const relevantTweets = tweets.filter((tweet) => id === tweet.user.id)
    relevantTweets.forEach(({ created_at, id: tweetId }) => runQuery(relation))
  })
}


loadQueries(queries)
loadTweets(tweets)
loadUsers(users)
tweetToQuery(tweets)
userToQuery(users)
userToTweet(users, tweets)
