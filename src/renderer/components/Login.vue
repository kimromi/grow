<template lang='pug'>
  div#wrapper
    span api url
    input(v-model="apiUrl")
    span web url
    input(v-model="webUrl")
    span token
    input(v-model="token")
    p(@click="test") test
    p {{ message }}
</template>

<script>
  import client from '../lib/github_client'
  import config from '../lib/config'

  export default {
    data () {
      return {
        apiUrl: '',
        webUrl: '',
        token: '',
        message: ''
      }
    },
    methods: {
      test () {
        client.check(this.apiUrl, this.token)
          .then(function (response) {
            if (response.status === 200) {
              config.set(config.keys.apiUrl, this.apiUrl)
              config.set(config.keys.webUrl, this.webUrl)
              config.set(config.keys.token, this.token)
              this.message = 'correct!'

              var self = this
              setTimeout(() => {
                self.$router.push('main')
              }, 1100)
            }
          }.bind(this))
          .catch(function () {
            this.message = 'authorization error'
          }.bind(this))
      }
    }
  }
</script>

<style lang='scss'>
</style>
