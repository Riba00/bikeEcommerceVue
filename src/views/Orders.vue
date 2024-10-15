<template>
  <BasicLayout>
    <h1>My Orders</h1>
    <h3 v-if="!orders">You don't have orders</h3>
    <template v-if="orders">
      <div class="order" v-for="order in orders" :key="order.id">
        <div class="header">
          <span class="date">{{ formatDate(createdAt) }}</span>
          <p>ID: {{ order.id }}</p>
          <p>
            TOTAL:
            <b>{{
              new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(order.totalPayment)
            }}</b>
          </p>
        </div>
        <div class="products">
          <div
            class="product"
            v-for="product in order.products"
            :key="product.id"
          >
            <div>
              <img
                :src="API_URL + product.image.url"
                :alt="product.name"
                class="ui image"
              />
              <p>{{ product.name }}</p>
            </div>
            <div>
              {{ product.quantity }} x
              {{
                new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price)
              }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import { onMounted, ref } from "vue";
import { getOrders } from "../api/order";
import { getTokenApi } from "../api/token";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import BasicLayout from "../layouts/BasicLayout.vue";
import { API_URL } from "../utils/constants";

export default {
  name: "Orders",
  components: {
    BasicLayout,
  },
  setup() {
    let orders = ref(null);

    onMounted(async () => {
      const token = getTokenApi();
      const { id } = jwtDecode(token);
      const response = await getOrders(id);

      orders.value = response;
    });

    const formatDate = (date) => {
      return moment(date).format("LLL");
    };

    return {
      orders,
      formatDate,
      API_URL,
    };
  },
};
</script>

<style lang="scss" scoped>
.order {
  border: 1px solid #000;
  margin-bottom: 20px;
  margin-top: 40px;

  .header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;

    p {
      margin: 0;
    }

    span {
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 12px;
    }
  }

  .products {
    border-top: 1px solid #000;

    .product {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 30px;

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .ui.image {
        width: 50px;
        padding-right: 10px;
    }
  }
}
</style>
