import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const routes = [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'e-commerce',
                    meta: {breadcrumb: ['Home']},
                    component: () => import('@/views/dashboards/Ecommerce.vue'),
                },
                {
                    path: '/products',
                    name: 'Products',
                    component: () => import('@/views/e-commerce/ProductList.vue'),
                },
                {
                    path: '/credit',
                    name: 'Credit',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/finish_credit',
                    name: 'Finish-Credit',
                    meta: {
                        breadcrumb: ['Finish-Credit']
                    },
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/create_user',
                    name: 'Create-User',
                    meta: {
                        breadcrumb: ['Create-User']
                    },
                    component: () => import('@/views/e-commerce/CreateUser.vue')
                },
            ],
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
        },
];

const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: "active",
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if(to.path === '/') {
        next({
            name: 'login'
        })
    } else {
        next()
    }
})

export default router;



