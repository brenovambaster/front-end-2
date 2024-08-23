import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'rtcc.token': token } = parseCookies();

export const api = axios.create({
    baseURL: 'http://localhost:8080',
})

// api.interceptors.request.use(config => {
//     console.log(config);

//     return config;
// });

if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}