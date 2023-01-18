import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const apiUrl = "https://vue3-course-api.hexschool.io/v2";

const app = createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            axios.post(`${apiUrl}/admin/signin`, this.user)
                .then((response) => {
                    const { token, expired } = response.data;

                    // 寫入 cookie token
                    // expires 設置有效時間
                    document.cookie = `loginToken=${token};expires=${new Date(expired)}; path=/`;
                    window.location = 'products.html';
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        }
    },
}).mount('#app');