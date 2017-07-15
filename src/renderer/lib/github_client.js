import axios from 'axios'

export default {
  check (url, token) {
    return axios.get(url, {headers: {'Authorization': `token ${token}`}})
  }
}
