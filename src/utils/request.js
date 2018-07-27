import Vue from 'vue'
import axios from 'axios'
import {router} from '@/router/index'
import * as tokenUtils from "./token";
import * as config from './sys-config'

const url="http://" +config.host+":"+config.port+config.server_context;

// create axios instance
const service = axios.create({
  baseURL:url,
  timeout: config.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request  interceptor
service.interceptors.request.use(config => {
  config.headers['token'] =tokenUtils.getToken()
  return config
}, error => {
  return Promise.reject(error)
})

// response  interceptor
service.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token invalid
    tokenUtils.removeToken()
    router.push({ name: 'login' })
  }
  if (response.data && response.data.code === 403) { // 403, no permission
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default service


