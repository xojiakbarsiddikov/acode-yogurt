<script setup>
import { ref } from 'vue';

import AppSubMenu from './AppSubMenu.vue';

const model = ref([
    {
        label: 'Dashboards',
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            to: '/dashboard',
            status: true,
          },
          {
            id: 2,
            label: 'Tovarlar',
            icon: 'pi pi-cart-plus',
            to: '/products',
            status: true,
          },
          {
            id: 3,
            label: 'Qarzdorlar',
            icon: 'pi pi-users',
            to: '/credit',
            status: true,
          },
          {
            id: 4,
            label: 'Qarzni-berganlar',
            icon: 'pi pi-verified',
            to: '/finish_credit',
            status: true,
          },
          {
            id: 5,
            label: 'User-yaratish',
            icon: 'pi pi-user-plus',
            to: '/create_user',
            status: true,
          },
          {
            id: 6,
            label: '',
            icon: '',
            to: '',
            class: 'border-bottom',
            status: true,
          },
          {
            id: 7,
            label: 'Chiqish',
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login',
            class: 'actives',
            status: true,
          },
        ]
    },
]);
</script>

<template>
    <AppSubMenu :model="model" />
</template>

<style lang="scss" scoped></style>
