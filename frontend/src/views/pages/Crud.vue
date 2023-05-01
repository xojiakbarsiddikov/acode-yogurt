<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import axios from 'axios';
import cookie from 'vue-cookies';
const api_url = import.meta.env.VITE_API_URL


const toast = useToast();
const { contextPath } = useLayout();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
let statuses = ref([]);
const sums = ref(null);
const count = ref(null);
const user = ref(null);

const dropdown = () => {
    axios.get(`${api_url}/get/product/`)
        .then((res) => {
            statuses.value = res.data.reverse();
        });
};

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
    dropdown();
});
onMounted(() => {
    productService.getTables().then((data) => {
        products.value = data.reverse();
        count.value = data.length;
    });

});

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.count) {
        if (product.value.id) {
            products.value[findIndexById(product.value.id)] = product.value;
            sums.value = (product.value.category.price / 100) * product.value.percent + product.value.category.price;
            sums.value = sums.value * product.value.count;
            product.value.price = sums.value;
            const date = new Date();
            product.value.date = date.toLocaleString();
            product.value.price = sums.value;
            product.value.price = product.value.price = sums.value.toString();
            const category = product.value.category
            const prices = product.value.price
            const round = Math.round(prices)
            if(cookie.get("username")) {
              user.value = cookie.get("username")
            } else {
              user.value = "User"
            }
            const form = {
                name: product.value.name,
                price: round,
                message: product.value.message,
                date: product.value.date,
                count: product.value.count,
                percent: product.value.percent,
                category: category.id,
            };
          await axios({
            method: "PATCH",
            url: `${api_url}/edit/owner/${product.value.id}/`,
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
            products.value.unshift(product.value);
          sums.value = (product.value.category.price / 100) * product.value.percent + product.value.category.price;
          sums.value = sums.value * product.value.count;
          product.value.price = sums.value.toString();
          const prices = product.value.price
          const round = Math.round(prices)
          const date = new Date();
          product.value.date = date.toLocaleString();
          product.value.price = sums.value;
          product.value.price = product.value.price = sums.value;
          const category = product.value.category
            const form = {
              name: product.value.name,
              price: round,
              message: product.value.message,
              date: product.value.date,
              count: product.value.count,
              percent: product.value.percent,
              category: category.id,
            };
          await axios({
            method: "POST",
            url: `${api_url}/owner/`,
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


const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = async (index) => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    await axios({
      method: "POST",
      url: `${api_url}/delete/owner/${index}/`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {window.location.reload()})
    .catch(err => (console.log(err)));
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

    const createId = () => {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.value.exportCSV();
    };

    const confirmDeleteSelected = id => {
        deleteProductsDialog.value = true;
    };
    const deleteSelectedProducts = () => {
        products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
        selectedProducts.value.map(async (e) => {
          console.log(e)
          await axios({
            method: "POST",
            url: `${api_url}/delete/owner/${e.id}/`,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {window.location.reload()})
          .catch(err => (console.log(err)));
        });
        deleteProductsDialog.value = false;
        selectedProducts.value = null;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
    };
</script>

<template>
    <div class='grid'>
        <div class='col-12'>
            <div class='card'>
                <Toolbar class='mb-4'>
                    <template v-slot:start>
                        <div class='my-2'>
                            <Button label='Sotish' icon='pi pi-plus' class='p-button-success mr-2' @click='openNew' />
                            <Button label='Ochirish' icon='pi pi-trash' class='p-button-danger'
                                    @click='confirmDeleteSelected(product.id)'
                                    :disabled='!selectedProducts || !selectedProducts.length' />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode='basic' accept='image/*' :maxFileSize='1000000' label='Import'
                                    chooseLabel='Import' class='mr-2 inline-block' />
                        <Button label='Export' icon='pi pi-upload' class='p-button-help' @click='exportCSV($event)' />
                    </template>
                </Toolbar>

                <DataTable
                    ref='dt'
                    :value='products'
                    v-model:selection='selectedProducts'
                    :paginator='true'
                    :rows='5'
                    :rowsPerPageOptions='[5, 10, 25]'
                    paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                    currentPageReportTemplate='Showing {first} to {last} of {totalRecords} products'
                    responsiveLayout='scroll'
                    :filters='filters'
                >
                    <template #header>
                        <div class='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
                            <h5 class='m-0'>Qarzdorlar: <span class='text-primary'>{{ count }}</span></h5>
                            <span class='block mt-2 md:mt-0 p-input-icon-left'>
                                <i class='pi pi-search' />
                                <InputText v-model="filters['global'].value" placeholder='Search users' />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode='multiple' headerStyle='width: 3rem'></Column>
                    <Column field='name' header='Name' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field='category' header='Category' :sortable='true'
                            headerStyle='width:14%; min-width:8rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Category</span>
                            <span v-for='item in slotProps.data' :key='item'>{{ item.label }}</span>
                        </template>
                    </Column>
                    <Column field='count' header='Count' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Count</span>
                            {{ slotProps.data.count }}
                        </template>
                    </Column>
                    <Column field='percent' header='Percent' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Percent</span>
                            {{ slotProps.data.percent + '%' }}
                        </template>
                    </Column>
                    <Column field='price' header='Balance' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Price</span>
                            {{ slotProps.data.price + 'so\'m' }}
                        </template>
                    </Column>
                    <Column field='message' header='Message' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Message</span>
                            {{ slotProps.data.message }}
                        </template>
                    </Column>
                    <Column field='date' header='Date' :sortable='true' headerStyle='width:14%; min-width:10rem;'>
                        <template #body='slotProps'>
                            <span class='p-column-title'>Date</span>
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                    <Column headerStyle='min-width:10rem;'>
                        <template #body='slotProps'>
                            <Button icon='pi pi-pencil' class='p-button-rounded p-button-success mr-2'
                                    @click='editProduct(slotProps.data)' />
                            <Button icon='pi pi-trash' class='p-button-rounded p-button-warning mt-2'
                                    @click='confirmDeleteProduct(slotProps.data)' />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible='productDialog' :value='product' :style="{ width: '450px' }"
                        header='Tovar Sotish'
                        :modal='true' class='p-fluid'>
                    <div class='field'>
                        <label for='name'>Name</label>
                        <InputText placeholder='Ism' id='name' v-model='product.name' autofocus
                                   :class="{ 'p-invalid': submitted && !product.name }" />
                    </div>
                    <div class='formgrid grid'>
                        <div class='field col'>
                            <label for='category1'>Category</label>
                              <Dropdown id='category1' v-model='product.category' :options='statuses'
                                      optionLabel='label' placeholder='Tovarlar'>
                                <template #value='slotProps'>
                                    <div v-if='slotProps.value && slotProps.value.value'>
                                    <span
                                        :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label
                                        }}</span>
                                    </div>
                                    <div v-else-if='slotProps.value && !slotProps.value.value'>
                                    <span
                                        :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value
                                        }}</span>
                                    </div>
                                    <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>
                    <div class='field'>
                        <label for='quantity'>Percent</label>
                        <div class=''>
                            <div class='p-inputgroup'>
                                <InputNumber :class="{ 'p-invalid': submitted && !product.percent }"
                                             id='quantity' v-model='product.percent' integeronly placeholder='Foiz' />
                                <span class='p-inputgroup-addon'>%</span>
                            </div>
                        </div>
                    </div>
                    <div class='field'>
                        <label for='count'>Count</label>
                        <div class=''>
                            <div class='p-inputgroup'>
                                <InputNumber id='count' v-model='product.count'
                                             :class="{ 'p-invalid': submitted && !product.count }"
                                             placeholder='Soni' />
                                <span class='p-inputgroup-addon'>сум</span>
                            </div>
                        </div>
                    </div>
                    <div class='all_price mt-4 mb-4' v-if='product.name && product.category && product.percent && product.count'>
                        <div class='lg:font-bold'>All Price:
                            <span :value='product'
                                class='text-primary lg:font-normal'>2
                                {{((product.category.price / 100) * product.percent + product.category.price) * product.count + "so'm" }}
                             </span>
                        </div>
                    </div>
                    <div class='field'>
                        <label for='count'>Message</label>
                        <span class='p-float-label'>
                            <Textarea inputId='textarea' rows='3' cols='30' v-model='product.message'
                                      placeholder='message...'></Textarea>
                        </span>
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
                        >Are you sure you want to delete <b>{{ product.name }}</b
                        >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="Yo'q" icon='pi pi-times' class='p-button-text'
                                @click='deleteProductDialog = false' />
                        <Button label='Ha' icon='pi pi-check' class='p-button-text'
                                @click='deleteProduct(product.id)' />
                    </template>
                </Dialog>

                <Dialog v-model:visible='deleteProductsDialog' :style="{ width: '450px' }" header="Tovarlarni o'chirish"
                        :modal='true'>
                    <div class='flex align-items-center justify-content-center'>
                        <i class='pi pi-exclamation-triangle mr-3' style='font-size: 2rem' />
                        <span v-if='product'>Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="Yo'q" icon='pi pi-times' class='p-button-text'
                                @click='deleteProductsDialog = false' />
                        <Button label='Ha' icon='pi pi-check' class='p-button-text' @click='deleteSelectedProducts' />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .mb-4 {
        text-align: start !important;
    }
</style>
