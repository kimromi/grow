import axios from 'axios'
import config from './config'
import db from '../lib/github_db'

export default {
  check (url, token) {
    return axios.get(url, {headers: {'Authorization': `token ${token}`}})
  },
  http () {
    return axios.create({
      baseURL: config.get(config.keys.apiUrl),
      timeout: 1000,
      headers: {'Authorization': `token ${config.get(config.keys.token)}`}
    })
  },
  async pageFetch (path, options = {}) {
    let page = 1
    let returns = []
    while (true) {
      let fetched = []
      await this.http().get(path, {params: Object.assign({page: page}, options)})
        .then(function (response) {
          if (response.data.length > 0) {
            fetched = response.data
            for (let repo of fetched) {
              returns.push(repo)
            }
          }
        })
      if (fetched.length === 0) {
        break
      }
      page++
    }
    return returns
  },
  async user () {
    if (db.get(db.keys.user) === undefined || db.get(db.keys.user) === null) {
      await this.http().get('/user')
        .then(function (response) {
          db.set(db.keys.user, response.data)
        })
    }
    return db.get(db.keys.user)
  },
  async organizations () {
    let orgs = await this.pageFetch('/user/orgs')
    return orgs
  },
  async repositories (org) {
    let repos = await this.pageFetch(`/orgs/${org}/repos`)
    return repos
  },
  async pullRequests (org, repo) {
    let user = await this.user()
    let pulls = []
    for (let issue of await this.pageFetch(`/repos/${org}/${repo}/issues`, {creator: user.login, sort: 'created', direction: 'desc'})) {
      if (issue.pull_request !== undefined) {
        pulls.push(issue)
      }
    }
    return pulls
  },
  pullRequest (org, repo, number) {
    return this.http().get(`/repos/${org}/${repo}/issues/${number}`)
  }
}
