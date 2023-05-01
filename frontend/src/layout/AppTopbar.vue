<script setup>
import AppBreadcrumb from './AppBreadcrumb.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import cookie from 'vue-cookies';

const { onMenuToggle, onProfileSidebarToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const username = ref(null);

onMounted(() => {
    bindOutsideClickListener();
    if(cookie.get("username")) {
      username.value = cookie.get("username")
    } else {
      username.value = "User"
    }
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const showProfileSidebar = () => {
    onProfileSidebarToggle();
};
</script>

<template>
    <div class="layout-topbar">
        <div class="topbar-start">
            <button type="button" class="topbar-menubutton p-link p-trigger" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>

            <AppBreadcrumb class="topbar-breadcrumb"></AppBreadcrumb>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <li class="text-primary text-900 text-xl font-medium cursor">{{ username }}</li>
                <li class="topbar-profile">
                    <button type="button" class="p-link" @click="showProfileSidebar"><img src="../assets/avatar.png" alt="Profile" /></button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
