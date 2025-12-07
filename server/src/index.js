const path = require('path')

const createApp = require('./app')
const DataStore = require('./datastore')

const PORT = process.env.PORT || 4000

async function start() {
  const dataPath = path.join(__dirname, '../data/db.json')
  const store = new DataStore(dataPath)
  await store.ensureReady()

  const app = createApp(store)
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${PORT}`)
  })
}

start().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error)
  process.exit(1)
})
