<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      h1 choose repositories

      h3(v-show="repositories.github.length > 0") GitHub
      form
        .checkbox(v-for="repo of repositories.github")
          label
            input(type="checkbox" :id="repo.name" v-model="repo.managed")
            span {{ repo.org }} / {{ repo.name }}

      h3(v-show="repositories.ghe.length > 0") GitHub Enterprise
      form
        .checkbox(v-for="repo of repositories.ghe")
          label
            input(type="checkbox" :id="repo.name" v-model="repo.managed")
            span {{ repo.org }} / {{ repo.name }}

      button.btn.btn-positive.btn-large(@click="ok") OK
</template>

<script>
  import config from '../lib/config'
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        repositories: {
          github: {},
          ghe: {}
        }
      }
    },
    watch: {
      repositories: {
        deep: true,
        handler () {
          db.set(db.keys.github.repos, this.repositories.github)
          db.set(db.keys.ghe.repos, this.repositories.ghe)
        }
      }
    },
    async mounted () {
      for (let service of ['github', 'ghe']) {
        if (config.get(config.keys[service].token)) {
          if (db.get(db.keys[service].repos) === undefined || db.get(db.keys[service].repos) === null) {
            db.set(db.keys[service].repos, await this.fetchRepositories(service))
          }
          this.repositories[service] = db.get(db.keys[service].repos)
        }
      }
    },
    methods: {
      async fetchRepositories (service) {
        let repos = []
        for (let org of db.get(db.keys[service].orgs)) {
          if (!org.managed) continue
          for (let repo of await client.repositories(service, org.name)) {
            repos.push({
              service: service,
              org: org.name,
              name: repo.name,
              managed: true
            })
          }
        }
        return repos
      },
      ok () {
        this.$router.push('main')
      }
    }
  }
</script>

<style lang='scss'>
  .pane {
    padding: 15px;
  }
  .checkbox {
    margin: 0;
  }
</style>
