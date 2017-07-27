import Store from 'electron-store'
const store = new Store()

export default {
  keys: {
    github: {
      user: 'github_user',
      orgs: 'github_orgs',
      repos: 'github_repos',
      pulls: 'github_pulls'
    },
    ghe: {
      user: 'ghe_user',
      orgs: 'ghe_orgs',
      repos: 'ghe_repos',
      pulls: 'ghe_pulls'
    }
  },
  set (key, value) {
    store.set(key, value)
  },
  get (key) {
    return store.get(key)
  }
}
