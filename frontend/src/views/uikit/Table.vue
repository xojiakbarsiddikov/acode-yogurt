<script setup>
import { ref, onBeforeMount, reactive, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import cookie from 'vue-cookies';
const api_url = import.meta.env.VITE_API_URL


import { useLayout } from '@/layout/composables/layout';

const { contextPath } = useLayout();

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const products = ref(null);
const dt = ref(null)
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();
const count = ref(null)
const username = ref(null)

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;

    initFilters1();
});

onMounted(() => {
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data.reverse()
        loading1.value = false;
        count.value = data.length
    });
    if(cookie.get("username")) {
      username.value = cookie.get("username")
    } else {
      username.value = "User"
    }
})

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const exportCSV = () => {
    dt.value.exportCSV();
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Qarzni berganlar ro'yhati: <span class="text-primary">{{ count }}</span></h5>
                <DataTable
                    ref='dt'
                    :value="customer1"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Search users" style="width: 100%" />
                            </span>
                            <div class='flex justify-content-between flex-column sm:flex-row h-full'>
                                <FileUpload mode='basic' accept='image/*' :maxFileSize='1000000' label='Import'
                                            chooseLabel='Import' class='mr-2 inline-block' />
                                <Button label='Export' icon='pi pi-upload' class='p-button-help' @click='exportCSV($event)' />
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" style="min-width: 12rem">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Category" filterField="country.name" style="min-width: 12rem">
                        <template #body="slotProps">
                            <span v-for="item in slotProps.data" :key="item.id">{{ item.label }}</span>
                        </template>
                    </Column>
                    <Column header="Count" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="slotProps">
                            {{ slotProps.data.count }}
                        </template>
                    </Column>
                    <Column header="Percent" filterField="percent" style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ slotProps.data.percent }}
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="slotProps">
                            {{ slotProps.data.price }}
                        </template>
                    </Column>
                    <Column field="message" header="Message" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="slotProps">
                            {{ slotProps.data.message }}
                        </template>
                    </Column>
                    <Column field="date" header="Date" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="slotProps">
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
