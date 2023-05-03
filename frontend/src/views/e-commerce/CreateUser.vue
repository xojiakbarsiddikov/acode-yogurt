<script setup>
import { computed, onMounted, ref } from 'vue';
import { ProductService } from '../../service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const productDialog = ref(false);
const products = ref(null);
const product = ref({});
const count = ref(null);
const all_count = ref(null);
const images = ref(null);
const more_count = ref(3)
const deleteProductDialog = ref(false);
const productService = new ProductService();
const username = ref(false)
const admin = ref(null)
const id = ref(null)
const api_url = import.meta.env.VITE_API_URL

onMounted(async () => {
  productService.getUsers().then((data) => {
    products.value = data.reverse();
    admin.value = data[data.length - 1]
    data.forEach((e) => {
      id.value = e.id
    })
    count.value = products.value.length - admin.value.id;
    let sum = 0;
    for (var i in data) {
      sum += data[i].count;
    }
    all_count.value = sum;
  });
})

computed(() => {
    const more = () => {
        return products.value.slice(0, more_count.value)
    }
    more()
})


const saveProduct = async () => {
    if (product.value.username && product.value.security.trim()) {
        if (product.value.id) {
            products.value[findIndexById(product.value.id)] = product.value;
            const form = {
              username: product.value.username,
              password: product.value.security,
            };
          await axios({
            method: "PATCH",
            url: `${api_url}/edit/user/${product.value.id}/`,
            data: form,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            console.log(res);
            window.location.reload()
          })
          .catch((err) => {
            console.log(err);
          });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            products.value.unshift(product.value)
            const form = {
                username: product.value.username,
                password: product.value.security,
            };
          await axios({
            method: "POST",
            url: `${api_url}/user/`,
            data: form,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
              .then(() => {window.location.reload()})
              .catch(err => (console.log(err)));
          toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const deleteProduct = async (index) => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    await axios.delete(`${api_url}/delete/user/${index}/`)
        .then(() => {window.location.reload()})
        .catch(err => (console.log(err)));
    product.value = {};
    deleteProductDialog.value = false;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    productDialog.value = true;
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const carouselResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);

const open = () => {
    product.value = {};
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
};
</script>

<template>
    <div class='surface-section px-4 py-8 md:px-6 lg:px-8 border-1 surface-border border-round'>
        <Button label='User Yaratish' icon='pi pi-fw pi-plus' class='p-button-help bg-primary border-primary' @click='open()' :disabled="!admin"/>
        <div class='header-text flex text-center justify-content-center mb-3'>
          <div class='text-900 font-medium text-3xl text-center mb-2 mt-2 text-center'>User: <span
              class='text-primary' v-if='count'>{{ products.length - admin.id }}</span><span v-else>0</span></div>
          <div class='text-900 font-medium text-3xl text-center mb-2 mt-2 ml-5'>Admin: <span
              class='text-red-600' v-if='admin'>{{ admin.id }}</span> <span v-else>0</span></div>
        </div>
        <p class='mt-0 p-0 mb-5 text-900 font-medium text-2xl'>Users</p>
        <div class='grid -mt-3 -ml-3 -mr-3'>
            <div class='col-12 product md:col-6 lg:col-3 mb-5 lg:mb-0'  v-for='item in products' :key='item.id'>
                <div class='p-2'>
                    <div class='shadow-2 p-4 surface-card border-round'>
                        <div class='relative mb-3 flex'>
                        <Button class='surface-card text-900 shadow-2 px-3 py-2 absolute btn'
                              :style="{ borderRadius: '1.5rem', top: '1rem' }" :label="item.id === 1 ? 'Admin' : 'User'" :class="item.id === 1 ? 'text-red-600' : 'text-primary'"></Button>
                            <div class='buttons p-button-rounded p-button-success mr-2 margin'>
                                <Button icon='pi pi-pencil' class='p-button-rounded p-button-success mr-2'
                                        @click='editProduct(item)' />
                                <Button icon='pi pi-trash'
                                        :disabled="item.id === 1 ? true : false"
                                        class='p-button-warning p-button p-button-icon-only p-button-rounded p-button-success mr-2'
                                        @click='confirmDeleteProduct(item)' />
                            </div>
                        </div>
                      <div class="icon">
                        <i class="pi pi-user text-center" :class="item.id === 1 ? 'text-red-600' : 'text-primary'"></i>
                      </div>
                        <div class='flex justify-content-between align-items-center mb-3'>
                            <span class='text-900 font-medium text-xl' :class="item.id === 1 ? 'text-red-600' : ''">{{ item.username }}</span>
                            <span class='text-xl font-medium' :class="item.id === 1 ? 'red-color' : 'text-primary'">{{ item.security }}</span>
                        </div>
                    </div>

                </div>
            </div>
            <div class='modal'>
                <Dialog v-model:visible='productDialog' :style="{ width: '450px' }"
                        header='User yaratish'
                        :modal='true' class='p-fluid'
                        :value='product'>
                    <div class='field'>
                        <label for='name'>Username</label>
                        <InputText placeholder='username' id='name' v-model='product.username' autofocus class="input" :class="{activess: username}"/>
                    </div>
                  <div class='field'>
                    <label for='quantity'>Password</label>
                    <div>
                      <div class='p-inputgroup'>
                        <InputText id='quantity' v-model='product.security' integeronly
                                     placeholder='Password'/>
                      </div>
                    </div>
                  </div>
                    <template #footer>
                        <Button label='Bekor qilish' icon='pi pi-times' class='p-button-text' @click='hideDialog' />
                        <Button label='Saqlash' icon='pi pi-check' class='p-button-text' @click='saveProduct' />
                    </template>
                </Dialog>

                <Dialog v-model:visible='deleteProductDialog' :style="{ width: '450px' }" header="Tovar o'chirish"
                        :modal='true'>
                    <div class='flex align-items-center justify-content-center'>
                        <i class='pi pi-exclamation-triangle mr-3' style='font-size: 2rem' />
                        <span v-if='product'
                        >Are you sure you want to delete <b>{{ product.username }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Yo'q" icon='pi pi-times' class='p-button-text'
                                @click='deleteProductDialog = false' />
                        <Button label='Ha' icon='pi pi-check' class='p-button-text'
                                @click='deleteProduct(product.id)' />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped>
.margin {
    margin: 0 auto;
}

.py-8 {
    padding-top: 3rem !important;
    padding-bottom: 2rem !important;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}
.icon i {
  font-size: 80px;
}
.red-color {
  color: #d9342b!important;
  display: none!important;
}
@media(max-width: 500px) {
    .header-text {
        margin: 27px 0!important;
    }
    .text-3xl {
        font-size: 1.5rem !important;
    }
}
@media(max-width: 380px) {
    .mr-2 {
        margin-right: 0.1rem !important;
    }
    .text-3xl {
        font-size: 1rem !important;
    }
}
.activess {
  box-shadow: none!important;
  border-color: red;
}
.btn {
  background: none;
  border: none;
}

</style>
