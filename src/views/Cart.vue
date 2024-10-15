<template>
  <BasicLayout>
    <h1>Cart</h1>
    <table class="ui celled table" v-if="products">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.quantity }}</td>
          <td>
            {{
              new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(product.price)
            }}
          </td>
          <td style="text-align: center">
            <i
              class="close icon"
              @click="deleteAllProductCart(product.documentId)"
              style="cursor: pointer"
            ></i>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><b>TOTAL</b></td>
          <td>
            <b>{{
              new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(getTotal())
            }}</b>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <button
      class="ui button primary fluid"
      v-if="products"
      @click="createOrder"
    >
      GENERATE ORDER
    </button>

    <h3 v-if="!products">No products in the Cart</h3>
  </BasicLayout>
</template>

<script>
import BasicLayout from "../layouts/BasicLayout.vue";
import {
  getProductsCartApi,
  deleteAllProductCartApi,
  deleteCartApi,
} from "../api/cart";
import { watchEffect, ref } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { createOrderApi } from "../api/order";
import { getTokenApi } from "../api/token";
import Swal from "sweetalert2";

export default {
  name: "Cart",
  components: {
    BasicLayout,
  },
  setup() {
    let products = ref(null);
    let reloadCart = ref(false);

    const router = useRouter();

    watchEffect(async () => {
      reloadCart.value;
      const response = await getProductsCartApi();
      products.value = response;
    });

    const getTotal = () => {
      let totalTemp = 0;

      products.value.forEach((product) => {
        totalTemp += product.price * product.quantity;
      });

      return totalTemp;
    };

    const deleteAllProductCart = (idProduct) => {
      deleteAllProductCartApi(idProduct);
      reloadCart.value = !reloadCart.value;
    };

    const createOrder = async () => {
      const token = getTokenApi();
      const { id } = jwtDecode(token);

      const data = {
        totalPayment: getTotal(),
        products: products.value,
        user: id,
      };

      try {
        const response = await createOrderApi(data);
        deleteCartApi();

        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Order created successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        router.push("/orders");
      } catch (error) {
        console.log(error);
      }
    };

    return {
      products,
      getTotal,
      deleteAllProductCart,
      createOrder,
    };
  },
};
</script>

<style></style>
