<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane.pane-one-fourth
      ul.list-group
        li.list-group-header
          input.form-control(type="text" placeholder="Search" @keyup="search" v-model="searchKeyword")
        li.list-group-header(v-show="pulls.github.length > 0")
          h4 GitHub
        li.list-group-item(v-for="pull of pulls.github" @click="open(pull)" v-show="pull.display")
          .media-body
            p.pull-repo {{ pull.org }} / {{ pull.repo }}
            p.pull-title {{ pull.title }}
            ul.pull-labels
              li(v-for="label of pull.labels" :style="{ background: '#' + label.color }")
                | {{ label.name }}
        li.list-group-header(v-show="pulls.ghe.length > 0")
          h4 GitHub Enterprise
        li.list-group-item(v-for="pull of pulls.ghe" @click="open(pull)" v-show="pull.display")
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
        pulls: {
          github: {},
          ghe: {}
        },
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

      for (let service of ['github', 'ghe']) {
        if (config.get(config.keys[service].token)) {
          if (db.get(db.keys[service].pulls) === undefined || db.get(db.keys[service].pulls) === null) {
            db.set(db.keys[service].pulls, await this.fetchPullRequests(service))
          }
          this.pulls[service] = db.get(db.keys[service].pulls)
        }
      }
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
      async fetchPullRequests (service) {
        let pulls = []
        for (let repo of db.get(db.keys[service].repos)) {
          if (!repo.managed) continue
          for (let pull of await client.pullRequests(service, repo.org, repo.name)) {
            pulls.push({
              service: service,
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
        for (let service of ['github', 'ghe']) {
          let pulls = []
          if (this.pulls[service].length === 0) continue

          for (let pull of this.pulls[service]) {
            await client.pullRequest(service, pull.org, pull.repo, pull.number)
              .then(function (response) {
                pull['labels'] = response.data.labels
                pulls.push(pull)
              })
          }
          db.set(db.keys[service].pulls, pulls)
          this.pulls[service] = pulls
        }
      },
      open (pull) {
        let webUrl = config.get(config.keys.ghe.webUrl)
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
