import axios from 'axios';
const url = import.meta.env.VITE_API_URL

export class ProductService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getProductsSmall () {
        return fetch(this.contextPath + 'demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    async getTables () {
        return await axios.get(`${url}/get/owner/`)
            .then(res => res.data);
    }

    async getProducts () {
        return await axios.get(`${url}/get/product/`)
            .then(res => res.data);
    }

    async getUsers () {
        return await axios.get(`${url}/get/user/`)
            .then(res => res.data);
    }

    async getFinishTables () {
        return await axios.get(`${url}/done/deal/`)
            .then(res => res.data);
    }

    getProductsMixed () {
        return fetch(this.contextPath + 'demo/data/products-mixed.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getProductsWithOrdersSmall () {
        return fetch(this.contextPath + 'demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getProductsWithOrdersLarge () {
        return fetch(this.contextPath + 'demo/data/products-orders.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
}
