require('babel-register')
const neo4j = require('neo4j-driver').v1
const users = require('../data/users.json')
const tweets = require('../data/queries.json')

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "password"))

const queries = [
  'CREATE (topshop:Query {tag: "topshop"})',
  'CREATE (lfw17:Query {tag: "lfw17"})',
  'CREATE (ivypark:Query {tag: "ivypark"})'
]

const loadQueries = (queries) => {
  const session = driver.session()
  const promises = queries.map((q) => session.run(q))
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}

const loadTweets = (tweets) => {
  const session = driver.session()
  const promises = tweets.map((
    {
      id,
      created_at,
      text,
      sentiment: { documentSentiment: { score, magnitude } },
      tag,
      user: { id: userId }
    }) => {
      const tweetQuery = `CREATE (a:Tweet {id: ${id}, userId: ${userId}, tag: "${tag}", documentScore: "${score}", documentMagnitude: "${magnitude}", text: "${text}", created_at: "${created_at}" })`
      return session.run(tweetQuery)
    })
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}

const loadUsers = (users) => {
  const session = driver.session()
  const promises = users.map((
    {
      id,
      name,
      screen_name,
      location,
      followers_count,
      friends_count
    }) => {
      const userQuery = `CREATE (a:User {id: ${id}, name: "${name}", screenName: "${screen_name}", location: "${location}", followers: "${followers_count}", friends: "${friends_count}"})`
      return session.run(userQuery)
    })
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}

const tweetToQuery = (tweets) => {
  const session = driver.session()
  const promises = tweets.map(({ id, created_at, tag }) => {
    const relation = `
    MATCH (a:Query), (b:Tweet)
    WHERE a.tag = '${tag}' AND b.id = '${id}'
    CREATE (b)-[:KEYWORD_OF { created_at: "${created_at}" }]->(a)
    `
    return session.run(relation)
  })
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}

const userToQuery = (users) => {
  const session = driver.session()
  const promises = users.map(({ id, tag }) => {
    const relation = `
    MATCH (a:User), (b:Query)
    WHERE a.id = ${id} AND b.tag = '${tag}'
    CREATE (a)-[:TWEETED_WITH_KEYWORD]->(b)
    `
    return session.run(relation)
  })
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}

const userToTweet = (users, tweets) => {
  const session = driver.session()
  const promises = users.map(({ id }) => {
    const relation = `
    MATCH (a:User), (b:Tweet)
    WHERE a.id = ${id} AND b.userId = ${id}
    CREATE (a)-[:TWEETED]->(b)
    `
    return session.run(relation)
  })
  return Promise.all(promises).then(() => session.close())
    .catch((err) => console.log(err))
}


// Promise.all([
  loadQueries(queries)
  loadTweets(tweets)
  loadUsers(users)
  tweetToQuery(tweets)
  userToQuery(users)
  userToTweet(users, tweets)
// ]).then(() => driver.close())
