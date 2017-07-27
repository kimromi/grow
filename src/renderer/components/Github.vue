<template lang='pug'>
  .pane-group
    .pane-sm.sidebar
    .pane
      p(v-show="error")
        router-link(to="/login")
          button.btn.btn-large.btn-negative Back
      p(v-show="correct") correct!
      webview(id="wv" :src="authURL")
</template>

<script>
  import config from '../lib/config'
  import axios from 'axios'
  import qs from 'qs'

  export default {
    data () {
      return {
        error: false,
        correct: false,
        clientId: '8b444fb52fa8fe80a5e8',
        clientSecret: '3bb9aa47a9d146b329598520366fe1f819559d88',
        scopes: ['user:email', 'notifications']
      }
    },
    computed: {
      authURL () {
        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&scope=${this.scopes}`
      }
    },
    mounted () {
      const webview = document.querySelector('webview')
      webview.addEventListener('did-get-response-details', function (event) {
        if (/\/\?code=/.test(event.newURL)) {
          this.handleCallback(event.newURL)
        }
        if (/\/\?error=/.test(event.newURL)) {
          this.handleCallbackError(event.newURL)
        }
      }.bind(this))
    },
    methods: {
      handleCallback (url) {
        var rawCode = /code=([^&]*)/.exec(url) || null
        var code = (rawCode && rawCode.length > 1) ? rawCode[1] : null

        axios.post('https://github.com/login/oauth/access_token', qs.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code
        }), {headers: { Accept: 'application/json' }})
        .then((response) => {
          this.correct = true
          config.set(config.keys.github.apiUrl, 'https://api.github.com')
          config.set(config.keys.github.webUrl, 'https://github.com')
          config.set(config.keys.github.token, response.data.access_token)

          setTimeout(function () {
            this.$router.push('main')
          }.bind(this), 1100)
        })
      },
      handleCallbackError () {
        alert('Failed! Please try again.')
        this.error = true
      }
    }
  }
</script>

<style lang='scss'>
  #wv {
    width: 100%;
    height: 100%;
  }
</style>
