<template>
  <BasicLayout>
    <div class="login">
      <h2>Log In</h2>

      <form class="ui form" @submit.prevent="onLogin">
        <div class="field">
          <input
            type="text"
            placeholder="Username"
            v-model="formData.identifier"
            :class="{ error: formError.identifier }"
          />
        </div>

        <div class="field">
          <input
            type="password"
            placeholder="Password"
            v-model="formData.password"
            :class="{ error: formError.password }"
          />
        </div>

        <button
          type="submit"
          class="ui button fluid primary"
          :class="{ loading: isLoading }"
        >
          Log In
        </button>
      </form>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

      <router-link to="/register">Create an account</router-link>
    </div>
  </BasicLayout>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import BasicLayout from "../layouts/BasicLayout.vue";
import { loginApi } from "../api/user";
import { setTokenApi, getTokenApi } from "../api/token";

export default {
  name: "Login",
  components: {
    BasicLayout,
  },
  setup() {
    let formData = ref({});
    let formError = ref({});
    let isLoading = ref(false);
    let errorMessage = ref("");

    const router = useRouter();
    const token = getTokenApi();

    onMounted(() => {
      if (token) {
        router.push("/");
      }
    });

    const schemaForm = Yup.object().shape({
      identifier: Yup.string().required(true),
      password: Yup.string().required(true),
    });

    const onLogin = async () => {
      formError.value = {};
      isLoading.value = true;

      try {
        await schemaForm.validate(formData.value, { abortEarly: false });

        try {
          const response = await loginApi(formData.value);

          if (!response?.jwt) {
            throw "Incorrect Username or Password";
          }

          setTokenApi(response.jwt);

          router.push("/");
        } catch (error) {
          console.log(error);
          errorMessage.value = error;
          formError.value["password"] = errorMessage;
        }
      } catch (error) {
        console.log(error);
        error.inner.forEach((err) => {
          formError.value[err.path] = err.message;
        });
      }

      isLoading.value = false;
    };

    return {
      formData,
      formError,
      isLoading,
      errorMessage,
      onLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
  > h2 {
    margin: 50px 0 30px 0;
  }

  .ui.form {
    max-width: 300px !important;
    margin: 0 auto;
    margin-bottom: 10px;

    input.error {
      border-color: #faa;
      background-color: #ffeded;
    }
  }
}
</style>
