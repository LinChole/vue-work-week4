import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';

let productModal = {};
let delProductModal = {};

const app = createApp({
    // 產品資料格式
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'chole-confidencew',
            isNew: false,//確認是編輯或新增使用
            page: {},
            products: [],
            tempProduct: {
                imagesUrl: []
            },

        }
    },
    methods: {
        checkAdmin() {
            //確認登入
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                //登入成功，取得產品資料
                .then(() => {
                    this.getData();
                })
                //未登入，跳回登入頁面
                .catch((err) => {
                    alert(err.response.data.message)
                    window.location = 'index.html';
                })
        },
        //遠端取得產品資料
        getData(page = 1) {//參數預設值
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then((response) => {
                    this.products = response.data.products;
                    this.page = response.data.pagination; //儲存page資訊儲起來
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        //更新產品
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }
            axios[http](url, { data: this.tempProduct })
                .then((response) => {
                    productModal.hide();
                }).catch((err) => {
                    alert(err.response.data.message);
                })
        },
        //點擊的字串是什麼開啟，什麼內容
        openModal(isNew, item) {
            console.log(isNew, item);
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url).then((response) => {
                alert(response.data.message);
                delProductModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        openProduct(item) {
            this.tempProduct = item;
        },
    },
    // 分頁元件，可以有很多子元件要加s
    components: {
        pagination,
    },
    // 生命週期
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkAdmin()
    },
});

//產品元件、更新元件
app.component('product-modal', {
    props: ['tempProduct', 'updateProduct'],
    template: '#product-modal-template',
});
//刪除元件
app.component('delproduct-modal', {
    props: ['tempProduct', 'delProduct'],
    template: '#delproduct-modal-template'
})
app.mount('#app');