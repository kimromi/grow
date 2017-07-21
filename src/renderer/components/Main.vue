<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane.pane-one-fourth
      ul.list-group
        li.list-group-header
          input.form-control(type="text" placeholder="Search for title")
        li.list-group-item(v-for="pull of pulls" @click="open(pull)")
          .media-body
            p.pull-repo {{ pull.org }} / {{ pull.repo }}
            p.pull-title {{ pull.title }}
    .pane
      webview(v-show="showURL != ''" id="wv" :src="showURL")
</template>

<script>
  import config from '../lib/config'
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        pulls: {},
        showURL: ''
      }
    },
    async created () {
      if (db.get(db.keys.orgs) === undefined || db.get(db.keys.orgs) === null) {
        this.$router.push('organizations')
        return
      }
      if (db.get(db.keys.repos) === undefined || db.get(db.keys.repos) === null) {
        this.$router.push('repositories')
      }

      if (db.get(db.keys.pulls) === undefined || db.get(db.keys.pulls) === null) {
        db.set(db.keys.pulls, await this.fetchPullRequests())
      }
      // db.set(db.keys.pulls, await this.fetchPullRequests())
      this.pulls = db.get(db.keys.pulls)
    },
    methods: {
      async fetchPullRequests () {
        let pulls = []
        for (let repo of db.get(db.keys.repos)) {
          if (!repo.managed) continue
          for (let pull of await client.pullRequests(repo.org, repo.name)) {
            pulls.push({
              org: repo.org,
              repo: repo.name,
              title: pull.title,
              number: pull.number,
              created_at: pull.created_at
            })
          }
        }
        return pulls
      },
      open (pull) {
        let webUrl = config.get(config.keys.webUrl)
        console.log(`${webUrl}/${pull.org}/${pull.repo}/pull/${pull.number}`)
        this.showURL = `${webUrl}/${pull.org}/${pull.repo}/pull/${pull.number}`
      }
    }
  }
</script>

<style lang='scss'>
  p.pull-repo {
    font-size: 11px;
  }
  p.pull-title {
    font-size: 13px;
  }
  #wv {
    width: 100%;
    height: 100%;
  }
</style>
