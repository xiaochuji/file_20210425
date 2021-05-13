import service from '../utils/request'
import serviceJson from '../utils/requestJson'
import { Loading } from 'element-ui'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { url } from '../utils/url.js'
let loading = null
// 用于form-data请求
const serviceFormData = axios.create({
  // baseURL: '/api',
  baseURL: url,
  headers: { 'Content-Type': 'multipart/form-data' }
})
serviceFormData.interceptors.request.use( // 请求拦截
  request => {
    loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.5)'
    })
    if (getToken()) {
      request.headers['token'] = getToken()
    }
    return request
  }
)
serviceFormData.interceptors.response.use(
  response => {
    loading.close()
    return response.data
  }
)

/**
 * Created by Administrator on 2019/10/29.
 */
const apiMethods = {
  methods: {
    apiPostFormData(url, data) {
      // 用于 content-type为 multipart/form-data
      return new Promise((resolve, reject) => {
        serviceFormData.post(
          url,
          data
        ).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    apiGet(url, data) {
      // console.log('url', url)
      // console.log('window.axios.defaults.headers.authorization', window.axios.defaults.headers.authorization)
      return new Promise((resolve, reject) => {
        service.get(url, data).then((response) => {
          // this.resetAuth(response)
          resolve(response.data)
        }, (response) => {
          reject(response)
          // this.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
    apiPost(url, data) {
      return new Promise((resolve, reject) => {
        service.post(url, data).then((response) => {
          console.log(url)
          // this.resetAuth(response)
          resolve(response.data)
        }).catch((response) => {
          resolve(response)
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
    apiPostJson(url, data) {
      return new Promise((resolve, reject) => {
        serviceJson.post(url, data).then((response) => {
          // this.resetAuth(response)
          resolve(response.data)
        }).catch((response) => {
          resolve(response)
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
    apiDelete(url, id, data) {
      return new Promise((resolve, reject) => {
        service.delete(url + id, { data: data }).then((response) => {
          // this.resetAuth(response)
          resolve(response.data)
        }, (response) => {
          reject(response)
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
    apiPut(url, id, obj) {
      return new Promise((resolve, reject) => {
        service.put(url + id, obj).then((response) => {
          // this.resetAuth(response)
          resolve(response.data)
        }, (response) => {
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
          reject(response)
        })
      })
    },
    handelResponse(res, cb, errCb) {
      if (res.code == 200) {
        cb(res.data)
      } else {
        if (typeof errCb === 'function') {
          errCb()
        }
        // this.handleError(res)
      }
    },
    goback() {
      this.$router.go(-1)
    },
    // resetAuth(res) {
    //   console.log(res)
    //   if (res.headers.token) {
    //     this.$store.commit('SET_TOKEN', data.token)
    //     // window.sessionStorage.setItem('authorization', res.headers.authorization) // 用户sessionid
    //     // window.axios.defaults.headers.authorization = res.headers.authorization
    //   }
    // },
    reAjax(url, data) {
      return new Promise((resolve, reject) => {
        service.post(url, data).then((response) => {
          resolve(response.data)
        }, (response) => {
          reject(response)
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    }
  },
  computed: {

  }
}

export default apiMethods
