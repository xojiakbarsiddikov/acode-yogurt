<script setup>
import { ref } from 'vue';
const product = ref({
    name: '',
    price: '',
    code: '',
    sku: '',
    status: 'Draft',
    tags: ['Nike', 'Sneaker'],
    category: 'Sneakers',
    colors: [],
    stock: 'Sneakers',
    inStock: true,
    description: '',
    images: []
});
const fileUploaderRef = ref(null);
const uploadFiles = ref([]);
const productDialog= ref(true)

const onChooseUploadFiles = () => {
    fileUploaderRef.value.choose();
};
const onSelectedFiles = (event) => {
    uploadFiles.value = event.files;
};
const onRemoveFile = (removeFile) => {
    uploadFiles.value = uploadFiles.value.filter((file) => file.name !== removeFile.name);
};

</script>

<template>
    <Dialog v-model:visible='productDialog' :value='product' :style="{ width: '450px' }"
            header='Tovar Sotish'
            :modal='true' class='p-fluid'>
        <div class='field'>
            <label for='name'>Name</label>
            <InputText placeholder='Ism' id='name' v-model='product.name' autofocus
                       :class="{ 'p-invalid': submitted && !product.name }" />
        </div>
        <div class='field'>
            <label for='quantity'>Count</label>
            <div>
                <div class='p-inputgroup'>
                    <InputNumber :class="{ 'p-invalid': submitted && !product.percent }"
                                 id='quantity' v-model='product.percent' integeronly placeholder='Soni' />
                </div>
            </div>
        </div>
        <div class='field'>
            <label for='quantity'>Price</label>
            <div>
                <div class='p-inputgroup'>
                    <InputNumber :class="{ 'p-invalid': submitted && !product.price }"
                                 id='quantity' v-model='product.price' integeronly placeholder='Narhi' />
                    <span class='p-inputgroup-addon'>so'm</span>
                </div>
            </div>
        </div>
        <div class='field'>
            <div class='col-12 mt-3 mb-5'>
                <FileUpload
                    ref='fileUploaderRef'
                    id='files-fileupload'
                    name='demo[]'
                    url='./upload.php'
                    accept='image/*'
                    customUpload
                    multiple
                    auto
                    class='border-1 surface-border surface-card p-0 border-round'
                    :maxFileSize='1000000'
                    @select='onSelectedFiles'
                >
                    <template v-if='uploadFiles.length > 0' #content>
                        <div class='h-20rem m-1 border-round'>
                            <div v-for='file in uploadFiles' :key='file.name'
                                 class='w-full h-full relative border-round p-0' :style="{ cursor: 'copy' }">
                                <div
                                    class='remove-file-wrapper h-full relative border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto'>
                                    <img :src='file.objectURL' alt='{file.name}'
                                         class='w-full h-full border-round' />
                                    <Button
                                        icon='pi pi-times'
                                        class='remove-button p-button-rounded p-button-primary text-sm absolute justify-content-center align-items-center cursor-pointer'
                                        :style="{ top: '-10px', right: '-10px', display: 'none', width: '3rem' }"
                                        @click='onRemoveFile(file)'
                                    ></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div v-if='uploadFiles.length < 1' class='h-20rem m-1 border-round'>
                            <div @click='onChooseUploadFiles'
                                 class='flex flex-column w-full h-full justify-content-center align-items-center cursor-pointer'
                                 :style="{ cursor: 'copy' }">
                                <i class='pi pi-fw pi-file text-4xl text-primary'></i>
                                <span class='block font-semibold text-900 text-lg mt-3'>Drop or select a cover image</span>
                            </div>
                        </div>
                    </template>
                </FileUpload>
            </div>
        </div>
        <template #footer>
            <Button label='Bekor qilish' icon='pi pi-times' class='p-button-text' @click='hideDialog' />
            <Button label='Saqlash' icon='pi pi-check' class='p-button-text' @click='saveProduct' />
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
::v-deep(#files-fileupload) {
    .p-fileupload-buttonbar {
        display: none;
    }
}

.remove-file-wrapper:hover {
    .remove-button {
        display: flex !important;
    }
}
</style>
