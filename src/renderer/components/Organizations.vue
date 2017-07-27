<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      h1 choose organizations

      h3(v-show="organizations.github.length > 0") GitHub
      form
        .checkbox(v-for="org of organizations.github")
          label
            input(type="checkbox" :id="org.name" v-model="org.managed")
            span {{ org.name }}

      h3(v-show="organizations.ghe.length > 0") GitHub Enterprise
      form
        .checkbox(v-for="org of organizations.ghe")
          label
            input(type="checkbox" :id="org.name" v-model="org.managed")
            span {{ org.name }}

      button.btn.btn-positive.btn-large(@click="ok") OK
</template>

<script>
  import config from '../lib/config'
  import client from '../lib/github_client'
  import db from '../lib/github_db'

  export default {
    data () {
      return {
        organizations: {
          github: {},
          ghe: {}
        }
      }
    },
    watch: {
      organizations: {
        deep: true,
        handler () {
          db.set(db.keys.github.orgs, this.organizations.github)
          db.set(db.keys.ghe.orgs, this.organizations.ghe)
        }
      }
    },
    async mounted () {
      for (let service of ['github', 'ghe']) {
        if (config.get(config.keys[service].token)) {
          if (db.get(db.keys[service].orgs) === undefined || db.get(db.keys[service].orgs) === null) {
            db.set(db.keys[service].orgs, await this.fetchOrganizations(service))
          }
          this.organizations[service] = db.get(db.keys[service].orgs)
        }
      }
    },
    methods: {
      async fetchOrganizations (service) {
        let orgs = []
        for (let org of await client.organizations(service)) {
          orgs.push({
            name: org.login,
            managed: false
          })
        }
        return orgs
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
