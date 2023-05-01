import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import axios from 'axios';
import cookie from 'vue-cookies'
import router from '../router';
const url = import.meta.env.VITE_API_URL

export const useLogin = defineStore("loginStore", {
    state: () => ({
        form:  reactive({
            username: '',
            password: '',
            role: null,
        }),
        username_err: false,
        password_err: false,
        arr: [],
        login: () => ({}),
    }),
    actions: {
         login() {
            const form = {
                username: this.form.username,
                password: this.form.password,
            }
             axios.post(`${url}/login/`, form)
                 .then(() => {
                     cookie.set("username", form.username, "2000000000d")
                     router.push({path: '/dashboard'})
                 })
                .catch((err) => {
                    console.log(err);
                })
         }
    }
})
