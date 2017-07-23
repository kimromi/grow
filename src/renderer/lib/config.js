import Store from 'electron-store'
const store = new Store()

export default {
  keys: {
    github: {
      apiUrl: 'github_api_url',
      webUrl: 'github_web_url',
      token: 'github_token'
    },
    ghe: {
      apiUrl: 'ghe_api_url',
      webUrl: 'ghe_web_url',
      token: 'ghe_token'
    }
  },
  set (key, value) {
    store.set(key, value)
  },
  get (key) {
    return store.get(key)
  }
}
