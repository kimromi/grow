import Store from 'electron-store'
const store = new Store()

export default {
  keys: {
    apiUrl: 'api_url',
    token: 'token'
  },
  set (key, value) {
    store.set(key, value)
  },
  get (key) {
    return store.get(key)
  }
}
