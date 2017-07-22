import Store from 'electron-store'
const store = new Store()

export default {
  keys: {
    user: 'user',
    orgs: 'orgs',
    repos: 'repos',
    pulls: 'pulls'
  },
  set (key, value) {
    store.set(key, value)
  },
  get (key) {
    return store.get(key)
  }
}
