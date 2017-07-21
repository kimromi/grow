import axios from 'axios'
import config from './config'

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
  async organizations () {
    let orgs = await this.pageFetch('/user/orgs')
    return orgs
  },
  async repositories (org) {
    let repos = await this.pageFetch(`/orgs/${org}/repos`)
    return repos
  },
  async pullRequests (org, repo) {
    let pulls = await this.pageFetch(`/repos/${org}/${repo}/pulls`, {sort: 'created', direction: 'desc'})
    return pulls
  },
  pullRequest (org, repo, number) {
    return this.http().get(`/repos/${org}/${repo}/issues/${number}`)
  }
}
