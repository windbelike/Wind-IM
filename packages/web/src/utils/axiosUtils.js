import axios from 'axios'

const backendDomain = process.env.NEXT_PUBLIC_BACKEND_HOST

axios.defaults.withCredentials = true
axios.defaults.baseURL = backendDomain

export default axios
