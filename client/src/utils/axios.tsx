import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const instance = axios.create();

instance.interceptors.request.use((config) => { 
    return new Promise(async (resolve) => {
        try {
            const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
            console.log(idToken?.toString())
            console.log(accessToken?.payload)

            let token = accessToken?.toString();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                resolve(config)
            }
        } catch (err) {
            throw err
        }
    })
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
})

export default instance;