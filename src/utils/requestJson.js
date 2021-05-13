import axios from 'axios'
import { Notification } from 'element-ui'
import { Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { url } from './url.js'

let loading = null
// create an axios instance
const serviceJson = axios.create({
  // baseURL: '/api',
  baseURL: url,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
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
serviceJson.interceptors.request.use(
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
serviceJson.interceptors.response.use(
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
    // if the custom code is not 200, it is judged as an error.
    const noIntercept = sessionStorage.getItem('noIntercept')
    tryHideFullScreenLoading()
    if (response.data.code != 200 && !noIntercept) {
      // Message({
      //   message: res.data.data || res.data.data.msg || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      if (response.data.code == '400' && !noIntercept) {
        // to re-login
        console.log(response.data.code)
        Notification.error(
          {
            title: '提示',
            message: response.data.msg
          }
        )
      }
      if (response.data.code == 399 && !noIntercept) {
        // to re-login
        return Promise.reject('noOrder')
      }
      if (response.data.code == '701' && !noIntercept) {
        // to re-login
        // console.log(store)
        store.dispatch('user/logout')
        // window.location.hash = 'user/login'
        Notification.error(
          {
            title: '提示',
            message: response.data.msg
          }
        )
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
        // to re-login
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
      // return Promise.reject(new Error(response.data.data || response.data.msg || 'Error'))
      return false
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

export default serviceJson
