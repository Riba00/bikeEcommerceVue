<template>
  <div class="ui secondary menu">
    <div class="ui container">
      <div class="left menu">
        <router-link class="item" to="/">
          <img
            class="ui small image"
            src="../assets/logo.png"
            alt="Ecommerce"
          />
          <template v-for="category in categories" :key="category.id">
            <router-link class="item" :to="category.slug">
              {{ category.title }}
            </router-link>
          </template>
        </router-link>
      </div>

      <div class="right menu">
        <router-link class="item" to="/login" v-if="!token">
          Log In
        </router-link>
        <template v-if="token">
          <router-link class="item" to="/orders">Orders</router-link>
          <span class="ui item cart" @click="openCart">
            <i class="shopping cart icon"></i>
          </span>
          <span class="ui item logout" @click="logOut">
            <i class="sign-out icon"></i>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getTokenApi, deleteTokenApi } from "../api/token";
import { getCategoriesApi } from "../api/category";
import { onMounted, ref } from "vue";
import { useStore } from 'vuex';

export default {
  name: "Menu",
  setup() {
    const token = getTokenApi();
    const store = useStore();
    let categories = ref(null);

    onMounted(async () => {
      const response = await getCategoriesApi();
      
      categories.value = response.data;
    });

    const logOut = () => {
      deleteTokenApi();
      location.replace("/");
    };

    const openCart = () => {
      store.commit('setShowCart', true);
    }

    return {
      categories,
      token,
      logOut,
      openCart
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.menu.secondary {
  background-color: #16202b;

  .item {
    color: #fff;
    &:hover {
      color: #1fa1f1;
    }
  }

  .menu.left {
    width: 50%;
    .ui.image {
      width: 40px;
    }
  }

  .menu.right {
    width: 50%;
    justify-content: flex-end;

    .logout,
    .cart {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
