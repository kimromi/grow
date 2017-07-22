<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane.pane-one-fourth
      ul.list-group
        li.list-group-header
          input.form-control(type="text" placeholder="Search" @keyup="search" v-model="searchKeyword")
        li.list-group-item(v-for="pull of pulls" @click="open(pull)" v-show="pull.display")
          .media-body
            p.pull-repo {{ pull.org }} / {{ pull.repo }}
            p.pull-title {{ pull.title }}
            ul.pull-labels
              li(v-for="label of pull.labels" :style="{ background: '#' + label.color }")
                | {{ label.name }}
    .pane
      .text-center(v-show="loadingShowURL")
        h6 loading..
      webview(v-show="!loadingShowURL && showURL != ''" id="wv" :src="showURL")
</template>

<script>
  import config from '../lib/config'
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        pulls: {},
        searchKeyword: '',
        loadingShowURL: false,
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
      this.pulls = db.get(db.keys.pulls)
    },
    mounted () {
      this.refreshLabels()

      const webview = document.querySelector('webview')
      webview.addEventListener('did-start-loading', function () {
        this.loadingShowURL = true
      }.bind(this))
      webview.addEventListener('did-stop-loading', function () {
        this.loadingShowURL = false
      }.bind(this))
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
              created_at: pull.created_at,
              display: true
            })
          }
        }
        return pulls
      },
      async refreshLabels () {
        let pulls = []
        for (let pull of this.pulls) {
          await client.pullRequest(pull.org, pull.repo, pull.number)
            .then(function (response) {
              pull['labels'] = response.data.labels
              pulls.push(pull)
            })
        }
        db.set(db.keys.pulls, pulls)
        this.pulls = pulls
      },
      open (pull) {
        let webUrl = config.get(config.keys.webUrl)
        this.showURL = `${webUrl}/${pull.org}/${pull.repo}/pull/${pull.number}`
      },
      search () {
        let r = new RegExp(this.searchKeyword, 'g')
        let pulls = []
        for (let pull of this.pulls) {
          pull.display = !!(pull.title.match(r) || pull.org.match(r) || pull.repo.match(r))
          pulls.push(pull)
        }
        this.pull = pulls
      }
    }
  }
</script>

<style lang='scss'>
  .list-group-item {
    &:hover {
      background: #EEE;
    }

    .media-body {
      p.pull-repo {
        font-size: 11px;
        color: gray;
      }
      p.pull-title {
        font-size: 13px;
      }
      ul.pull-labels {
        padding: 0;

        li {
          margin-right: 3px;
          padding: 0 5px;
          display: inline-block;
          border-radius: 3px;
        }
      }
    }
  }
  #wv {
    width: 100%;
    height: 100%;
  }
</style>
