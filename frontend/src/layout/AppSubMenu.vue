<script setup>
import AppMenuItem from './AppMenuItem.vue';

defineProps({
    model: {
        type: Array,
        default: null
    }
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <AppMenuItem :item="item" root :index="i" />

            <li class="menu-separator"></li>
        </template>
    </ul>
    <div class="developed">
      <a href="https://acode.uz/" target="_blank">
        <img class="logo" src='../assets/a_logo1.png' alt='acode-logo'>
      </a>
    </div>
</template>
<style scoped>
 .developed {
     position: absolute;
     bottom: 0;
     width: 16rem;
 }
 .logo {
     width: 100px;
     display: flex;
     justify-content: center;
     align-items: center;
     margin: 0 auto;
     transform: translateY(-10px);
 }
</style>
