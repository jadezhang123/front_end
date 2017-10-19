/**
 * Created by Zhang Junwei on 2017/10/18.
 */
import toastr from './misc/toastr.esm'
import axios from 'axios'

export const baseURL = process.env.NODE_ENV === 'production' ? '' : '/api'

export const http = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

/* Add a response interceptor handing global errors */
http.interceptors.request.use(config => {
  console.log('request url:' + config.url)
  return config
})

http.interceptors.response.use(response => {
  if (response.data.code !== 0) {
    toastr.error(response.data.msg)
  }
  return response
}, error => {
  var response = error.response
  if (!response) {
    toastr.info('服务器太久没有响应, 请重试!')
    return
  }
  toastr.error(response.data.msg || error)
  return Promise.reject(error)
})

export const Foo = {
  list: () => http.get('foo/list'),
  del: (id) => http.delete('foo/' + id)
}
