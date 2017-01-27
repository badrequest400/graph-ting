require('babel-register')
const neo4j = require('neo4j-driver').v1

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"))
const session = driver.session()

const queries = require('../data/queries.json')

const runQuery = (query) => {
  session.run(query).then(() => {
    session.close()
    driver.close()
  })
}

[
  'CREATE (topshop:Query {tag: "topshop"})',
  'CREATE (lfw17:Query {tag: "lfw17"})',
  'CREATE (ivypark:Query {tag: "ivypark"})'
].map(runQuery)

const tweetSentiments = require('../data/sentiments.json')

tweetSentiments.map(({ text, sentiment: { ... }, tag }) => runQuery(`CREATE (${text}:Tweet {tag: "${tag}", sentiment: { ${...} }})`))

//https://neo4j.com/docs/developer-manual/current/cypher/clauses/match/#_relationships_in_depth
