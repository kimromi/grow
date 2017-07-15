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
  import config from '../lib/config'
  import axios from 'axios'

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
        axios.get(this.apiUrl, {headers: {'Authorization': `token ${this.token}`}})
          .then(function (response) {
            if (response.status === 200) {
              config.set(config.keys.apiUrl, this.apiUrl)
              config.set(config.keys.webUrl, this.webUrl)
              config.set(config.keys.token, this.token)
              this.message = 'correct!'
              setTimeout(() => {
                console.log('次のページへ')
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
