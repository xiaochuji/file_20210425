import axios from 'axios'
import { Notification } from 'element-ui'
import { Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { url } from './url.js'

var loading = null
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: '/api',
  baseURL: url,
  headers: { 'Content-Type': 'application/json;chartset=UTF-8' },
  timeout: 60000 // request timeout
})
function startLoading() { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })
}
function endLoading() { // 使用Element  loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// request interceptor
service.interceptors.request.use(
  config => {
    showFullScreenLoading()
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    tryHideFullScreenLoading()
    // if the custom code is not 200, it is judged as an error.
    const noIntercept = sessionStorage.getItem('noIntercept')
    if (response.data.code !== 200 && !noIntercept) {
      // Message({
      //   message: res.data.data || res.data.data.msg || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      if (response.data.code == 400 && !noIntercept) {
        // to re-login
        Notification.error(
          {
            title: '提示',
            message: response.data.msg
          }
        )
        return false
      }
      if (response.data.code == '701' && !noIntercept) {
        // console.log(response)
        // to re-login
        store.dispatch('user/logout')
        Notification.error(
          {
            title: '提示',
            message: res.data.msg
          }
        )
        return false
      }
      // Notification.error(
      //   {
      //     title: '提示',
      //     message: res.data.msg
      //   }
      // )

      // 500
      if (response.data.code == 500 && !noIntercept) {
        // to re-login
        Notification.error(
          {
            title: '提示',
            message: '系统繁忙，请稍后再试'
          }
        )
      }
      if (response.data.code == 403 && !noIntercept) {
        // to re-logi
        Notification.error(
          {
            title: '提示',
            message: '登录失效，请重新登录'
          }
        )
        this.$router.push({
          path: '/login'
        })
      }
      return Promise.reject(new Error(response.data.data || response.data.data.msg || 'Error'))
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Notification.error(
      {
        title: '提示',
        message: '系统繁忙，请稍后再试'
      }
    )
    return Promise.reject(error)
  }
)

export default service
