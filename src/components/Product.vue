<template>
  <div class="ui card product">
    <div class="image">
      <img :src="API_URL + product.image.url" :alt="product.name" />
    </div>
    <div class="content">
      <div class="header">
        {{ product.name }}
      </div>
      <div class="description">
        {{
          new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(product.price)
        }}
      </div>
    </div>
    <div class="ui button primary" @click="addProductCart(product.documentId)">
      BUY
    </div>
  </div>
</template>

<script>
import { API_URL } from "../utils/constants";
import { addProductCartApi } from "../api/cart";
import { useStore } from "vuex";

export default {
  name: "Product",
  props: {
    product: Object,
  },
  setup(props) {
    const store = useStore();

    const addProductCart = (idProduct) => {
      addProductCartApi(idProduct);
      store.commit("setShowCart", true);
    };
    return {
      API_URL,
      addProductCart,
    };
  },
};
</script>

<style lang="scss" scoped>
.product {
  &:hover {
    .ui.button {
      min-height: 36px;
    }
  }

  .ui.button {
    max-height: 0;
    min-height: 0;
    overflow: hidden;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.6s ease;
  }
}
</style>
