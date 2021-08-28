<template>
  <div>
    <v-app-bar app absolute dense color="primary" dark elevate-on-scroll>
      <v-toolbar-title>
        <router-link to="/">
          <span class="white--text">Pengelolaan File</span>
        </router-link>
        <v-icon class="black--text">mdi-chevron-right</v-icon>
        <router-link to="/login">
          <span class="white--text">Login</span>
        </router-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-card class="mx-auto" max-width="512">
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="12">
                <v-alert v-if="loginSalah" color="red" dark>
                  Nama atau Password Salah!
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="nama"
                  :items="users"
                  item-text="nama"
                  item-value="nama"
                  label="Nama"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  @click:append="showPassword = !showPassword"
                  v-on:keyup.enter="login"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" block v-on:click="login">Masuk</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      users: [],
      nama: "",
      password: "",
      showPassword: false,
      loginSalah: false,
    };
  },
  created: async function () {
    const usersRequest = await this.getData("/user/get");
    this.users = await usersRequest.json();
  },
  methods: {
    getData: async function (path) {
      const result = await fetch(this.$url + path).then(function (r) {
        return r;
      });
      return result;
    },
    postData: async function (path, body) {
      const result = await fetch(this.$url + path, {
        method: "POST",
        body: body,
      }).then(function (r) {
        return r;
      });
      return result;
    },
    login: async function () {
      var loginData = new FormData();
      loginData.append("nama", this.nama);
      loginData.append("password", this.password);
      const loginRequest = await this.postData("/auth/login", loginData);
      if (loginRequest.status != 200) {
        this.loginSalah = true;
      } else {
        this.loginSalah = false;
        const loginResponse = await loginRequest.json();
        localStorage.token = loginResponse.token;
        this.$router.push("/");
      }
    },
  },
};
</script>
