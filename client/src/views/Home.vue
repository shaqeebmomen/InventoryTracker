<!-- This view will display the login form and redirect to the parts page as necesary based off auth state -->

<template>
  <div id="home-container" class="mx-12">
    <!-- Login Form -->
    <v-form ref="form" v-model="valid" class="mb-8">
      <v-container fluid>
        <v-row>
          <v-text-field
            ref="emailInput"
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
            @keyup.enter="submit"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            ref="passInput"
            v-model="pass"
            :rules="passRules"
            type="password"
            label="Password"
            required
            class="pb-2"
            @keyup.enter="submit"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-col class="pl-0">
            <v-btn
              :loading="loading"
              :disabled="!valid || loading"
              color="success"
              @click="submit"
            >Submit</v-btn>
          </v-col>
          <v-col>
            <v-btn color="error" @click="reset">Reset</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="pr-0">
            <v-btn outlined color="accent" @click="guestLogin">Continue as Guest</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-alert dense outlined v-if="authError" type="error">{{this.authError}}</v-alert>
  </div>
</template>

<script>
import router from "@/router/index.js";
import store from "@/store/index.js";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      valid: false,
      // Form inputs
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      pass: "",
      passRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 10) || "Password must be larger than 10 characters",
      ],
      // User status
      user: null,
      authError: null,
      loading: null,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      this.user = await store.dispatch("login", {
        email: this.email,
        pass: this.pass,
      });
      this.loading = false;
      if (this.user.user) {
        router.push("Parts");
      } else if (this.user.errors) {
        this.authError = this.user.errors.message;
      } else {
        this.authError = "Error Logging In";
      }
    },
    async guestLogin() {
      this.loading = true;
      this.user = await store.dispatch("login", {
        email: "guest@guest.ca",
        pass: "guest12345",
      });
      this.loading = false;
      if (this.user.user) {
        router.push("Parts");
      } else if (this.user.errors) {
        this.authError = this.user.errors.message;
      } else {
        this.authError = "Error Logging In";
      }
    },
    reset() {
      this.authError = null;
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  #home-container {
    width: 80%;
  }
}
@media only screen and (min-width: 600px) {
  #home-container {
    width: 60%;
  }
}
@media only screen and (min-width: 960px) {
  #home-container {
    width: 40%;
  }
}
</style>
