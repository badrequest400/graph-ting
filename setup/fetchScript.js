require('babel-register')
const { client, getQuery, getFriends, getFavourites, getUser } = require('./fetch.js')
const fs = require('fs')
const path = require('path')

const queries = [ 'topshop', 'ivy park', 'lfw17' ]
const ofInterest = [ 'asos', 'zalando' ]

const getAllQueries = (client, queries) => {
  return Promise.all(queries.map((query) => getQuery(client, query)))
}
const getAllUsers = (client, users) => {
  return Promise.all(users.map(({ tag, id }) => getUser(client, id, tag)))
}

getAllQueries(client, queries)
  .then((results) => {
    const merged = results.reduce((acc, res) => acc.concat(res), [])
    const write = fs.writeFileSync(path.resolve(__dirname, '../data/queries.json'), JSON.stringify(merged))
    const users = merged.map((status) => ({tag: status.tag, id: status.user.id_str}))
    getAllUsers(client, users)
      .then((results) => {
        const merged = results.reduce((acc, res) => acc.concat(res), [])
        const write = fs.writeFileSync(path.resolve(__dirname, '../data/users.json'), JSON.stringify(merged))
      })
  })
