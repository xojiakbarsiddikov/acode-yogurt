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
const api_url = import.meta.env.VITE_API_URL

onMounted(() => {
  productService.getProducts().then((data) => {
    products.value = data.reverse();
    count.value = products.value.length;
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
    if (product.value.label && product.value.label.trim() && product.value.count) {
        if (product.value.id) {
            products.value[findIndexById(product.value.id)] = product.value;
            const form = {
                label: product.value.label,
                count: product.value.count,
                price: product.value.price,
                value: product.value.label,
                message: product.value.message
            };
          await axios({
            method: "PATCH",
            url: `${api_url}/edit/product/${product.value.id}/`,
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
                label: product.value.label,
                count: product.value.count,
                price: product.value.price,
                value: product.value.label,
                message: product.value.message
            };
          await axios({
            method: "POST",
            url: `${api_url}/product/`,
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
  console.log(index)
    products.value = products.value.filter((val) => val.id !== product.value.id);
    await axios.delete(`${api_url}/delete/product/${index}/`)
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
        <Button label='Tovar Yaratish' icon='pi pi-fw pi-plus' class='p-button-help' @click='open()' />
        <div class='header-text flex text-center justify-content-center mb-3'>
            <div class='text-900 font-medium text-3xl text-center mb-2 mt-2 text-center'>Tovarlar turi: <span
                class='text-primary' v-if='count'>{{ count + 'hil' }}</span><span v-else>0</span></div>
            <div class='text-900 font-medium text-3xl text-center mb-2 mt-2 ml-5'>Tovarlar soni: <span
                class='text-primary' v-if='all_count'>{{ all_count + 'ta' }}</span> <span v-else>0</span></div>
        </div>
        <p class='mt-0 p-0 mb-5 text-900 font-medium text-2xl'>All Products</p>
        <div class='grid -mt-3 -ml-3 -mr-3'>
            <div class='col-12 md:col-6 lg:col-3 mb-5 lg:mb-0'  v-for='item in products' :key='item.id'>
                <div class='p-2'>
                    <div class='shadow-2 p-4 surface-card border-round'>
                        <div class='relative mb-3 flex'>
                        <span class='surface-card text-900 shadow-2 px-3 py-2 absolute'
                              :style="{ borderRadius: '1.5rem', top: '1rem' }"> Product </span>
                            <div class='buttons p-button-rounded p-button-success mr-2 margin'>
                                <Button icon='pi pi-pencil' class='p-button-rounded p-button-success mr-2'
                                        @click='editProduct(item)' />
                                <Button icon='pi pi-trash'
                                        class='p-button-warning p-button p-button-icon-only p-button-rounded p-button-success mr-2'
                                        @click='confirmDeleteProduct(item)' />
                            </div>
                        </div>
                        <img src='../../assets/yogurt.png' class='w-full' :alt='item.label' />
                        <div class='flex justify-content-between align-items-center mb-3'>
                            <span class='text-900 font-medium text-xl'>{{ item.label }}</span>
                            <span>
                            <span class='font-medium text-2xl'>{{ item.count + 'ta' }}</span>
                        </span>
                        </div>
                        <p class='mt-0 mb-3 text-700 line-height-3'>{{ item.message }}</p>
                        <span class='text-primary text-xl font-medium'>{{ item.price }}</span>
                    </div>

                </div>
            </div>
            <div class='modal'>
                <Dialog v-model:visible='productDialog' :style="{ width: '450px' }"
                        header='Tovar Sotish'
                        :modal='true' class='p-fluid'
                        :value='product'>
                    <div class='field'>
                        <label for='name'>Name</label>
                        <InputText placeholder='Tovar Nomi' id='name' v-model='product.label' autofocus />
                    </div>
                    <div class='field'>
                        <label for='quantity'>Count</label>
                        <div>
                            <div class='p-inputgroup'>
                                <InputNumber id='quantity' v-model='product.count' integeronly
                                             placeholder='Tovar Soni' />
                            </div>
                        </div>
                    </div>
                    <div class='field'>
                        <label for='quantity'>Price</label>
                        <div>
                            <div class='p-inputgroup'>
                                <InputNumber id='quantity' v-model='product.price' integeronly
                                             placeholder='Tovar Narhi' />
                                <span class='p-inputgroup-addon'>so'm</span>
                            </div>
                        </div>
                    </div>
                    <div class='field'>
                        <label for='count'>Message</label>
                        <span class='p-float-label'>
                            <Textarea inputId='textarea' rows='3' cols='30' v-model='product.message'
                                      placeholder='message...'></Textarea>
                        </span>
                    </div>
                    <!--            <div class='field'>-->
                    <!--                <div class='col-12 mt-3 mb-5'>-->
                    <!--                    <FileUpload-->
                    <!--                        v-model='product.image'-->
                    <!--                        ref='fileUploaderRef'-->
                    <!--                        id='files-fileupload'-->
                    <!--                        name='demo[]'-->
                    <!--                        url='./upload.php'-->
                    <!--                        accept='image/*'-->
                    <!--                        multiple-->
                    <!--                        auto-->
                    <!--                        class='border-1 surface-border surface-card p-0 border-round'-->
                    <!--                        :maxFileSize='1000000'-->
                    <!--                        @select='onSelectedFiles'-->
                    <!--                    >-->
                    <!--                        <template v-if='uploadFiles.length > 0' #content>-->
                    <!--                            <div class='h-20rem m-1 border-round'>-->
                    <!--                                <div v-for='file in uploadFiles' :key='file.name'-->
                    <!--                                     class='w-full h-full relative border-round p-0' :style="{ cursor: 'copy' }">-->
                    <!--                                    <div-->
                    <!--                                        class='remove-file-wrapper h-full relative border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto'>-->
                    <!--                                        <img :src='file.objectURL' alt='{file.name}'-->
                    <!--                                             class='w-full h-full border-round' />-->
                    <!--                                        <Button-->
                    <!--                                            icon='pi pi-times'-->
                    <!--                                            class='remove-button p-button-rounded p-button-primary text-sm absolute justify-content-center align-items-center cursor-pointer'-->
                    <!--                                            :style="{ top: '-10px', right: '-10px', display: 'none', width: '3rem' }"-->
                    <!--                                            @click='onRemoveFile(file)'-->
                    <!--                                        ></Button>-->
                    <!--                                    </div>-->
                    <!--                                </div>-->
                    <!--                            </div>-->
                    <!--                        </template>-->
                    <!--                        <template #empty>-->
                    <!--                            <div v-if='uploadFiles.length < 1' class='h-20rem m-1 border-round'>-->
                    <!--                                <div @click='onChooseUploadFiles'-->
                    <!--                                     class='flex flex-column w-full h-full justify-content-center align-items-center cursor-pointer'-->
                    <!--                                     :style="{ cursor: 'copy' }">-->
                    <!--                                    <i class='pi pi-fw pi-file text-4xl text-primary'></i>-->
                    <!--                                    <span class='block font-semibold text-900 text-lg mt-3'>Drop or select a cover image</span>-->
                    <!--                                </div>-->
                    <!--                            </div>-->
                    <!--                        </template>-->
                    <!--                    </FileUpload>-->
                    <!--                </div>-->
                    <!--            </div>-->
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
                        >Are you sure you want to delete <b>{{ product.label }}</b>?</span>
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
</style>