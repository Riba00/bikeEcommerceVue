<template>
  <BasicLayout>
    <h1>Bike</h1>
    <div class="ui grid">
      <div class="sixten wide mobile eight wide tablet four wide computer column" v-for="product in products" :key="product.id">
        <Product :product="product" />
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "../layouts/BasicLayout.vue";
import Product from '../components/Product.vue'
import { getProductsApi } from '../api/product';
import { onMounted, ref } from 'vue';

export default {
  name: "HomeView",
  components: {
    BasicLayout,
    Product
  },
  setup() {
    let products = ref(null);

    onMounted(async()=> {
      products.value = await getProductsApi(20);      
    })

    return {
      products
    }
  }
};
</script>
