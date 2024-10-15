<template>
  <div class="cart-header">
    <h2>Carrito</h2>
    <i class="close icon" @click="closeCart"/>
  </div>
</template>

<script>
export default {
  name: "Cartheader",
  props: {
    closeCart: Function
  }
};
</script>

<style lang="scss" scoped>
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  border-bottom: 1px solid #000;
  padding: 10px 20px;

  p,
  i {
    margin: 0;
  }

  i:hover {
    cursor: pointer;
  }
}
</style>
