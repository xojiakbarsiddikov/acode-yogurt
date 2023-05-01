<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useLogin } from '../store/useLogin';
import { onMounted, ref } from 'vue';
import { ProductService } from '../service/ProductService';
import cookie from 'vue-cookies';

const { layoutState } = useLayout();
const loginStore = useLogin();
const productService = new ProductService()
const username = ref(null)
const tables = ref(null);
const sums = ref(null);
const minusSums = ref(null);
const allSums = ref(null);
const credit = ref(null);
const finishCredit = ref(null);
const countProducts = ref(null);

onMounted(async () => {
    if(cookie.get("username")) {
        username.value = cookie.get("username")
    } else {
        username.value = "User"
    }
    productService.getTables().then((data) => {
        let sum = 0;
        for (var i in data) {
            sum += data[i].price;
        }
        sums.value = sum;
    });
    productService.getProducts().then((data) => {
        minusSums.value = data.length;
        let sum = 0;
        for (var i in data) {
            sum += data[i].count;
        }
        countProducts.value = sum;
    });
    productService.getFinishTables().then((data) => {
        finishCredit.value = data.length;
    });
    productService.getTables().then((data) => {
        credit.value = data.length;
        let sum = 0;
        for (var i in data) {
            sum += data[i].count;
            allSums.value = countProducts.value - sum;
        }
        tables.value = sum;
    });
})

</script>

<template>
    <Sidebar v-model:visible="layoutState.profileSidebarVisible.value" position="right" class="layout-profile-sidebar w-full sm:w-25rem">
        <div class="flex flex-column mx-auto md:mx-0">
            <span class="font-semibold mb-5">Welcome: &nbsp;<span class="text-primary">{{ username  }}</span></span>
            <ul class="list-none m-0 p-0 mb-6 ul pb-4">
            <li class="font-semibold mb-3 text-primary text">Recommendation</li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-bitcoin text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Mahsulotlar soni</span>
                            <p class="text-primery m-0">{{ countProducts }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-dollar text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Balans</span>
                            <p class="text-color-secondary m-0">{{ sums + "so'm" }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-money-bill text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Qardorlar</span>
                            <p class="text-color-secondary m-0">{{ credit + 'ta' }}</p>
                        </div>
                    </a>
                </li>
            </ul>
            <ul class="list-none m-0 p-0">
                <li class="font-semibold mb-3 text-primary">All Categorys</li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-slack text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Jami</span>
                            <p class="text-primery m-0">Sotilgan mahsulotlar: {{ tables }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-cart-plus text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Mahsulotlar turlari</span>
                            <p class="text-color-secondary m-0">{{ minusSums + 'hil' }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-users text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Sotilgan mahsulotlar</span>
                            <p class="text-color-secondary m-0">{{ tables + 'ta' }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-user-minus text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Qolgan mahsulotlar</span>
                            <p class="text-color-secondary m-0">{{ allSums + 'ta' }}</p>
                        </div>
                    </a>
                </li>
                <li>
                    <a class="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
                        <span>
                            <i class="pi pi-verified text-xl text-primary"></i>
                        </span>
                        <div class="ml-3">
                            <span class="mb-2 font-semibold">Qarzni berganlar</span>
                            <p class="text-color-secondary m-0">{{ finishCredit + 'ta' }}</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </Sidebar>
</template>
<style scoped>
 .ul {
     border-bottom: 1px solid var(--primary-color);
 }
 .text {
     text-align: start;
 }
</style>
