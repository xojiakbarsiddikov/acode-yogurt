import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useCreateUser = defineStore("loginStore", {
    state: () => ({
        form: reactive({
            username: '',
            password: ''
        }),
    })
})
