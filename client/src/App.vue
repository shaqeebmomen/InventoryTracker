<template >
  <v-app>
    <!-- Title -->
    <v-app-bar color="primary" app class="white--text">
      <v-badge v-if="user" overlap color="secondary" :content="notifCount" :value="notifCount">
        <!-- <v-app-bar-nav-icon class="white--text" large @click="showNav = !showNav"></v-app-bar-nav-icon> -->
        <v-icon large class="white--text" @click="showNav = !showNav">mdi-menu</v-icon>
      </v-badge>
      <v-toolbar-title class="mx-auto">
        <h2>Inventory Tracker</h2>
      </v-toolbar-title>
      <v-tooltip v-if="user" left>
        <template v-slot:activator="{on,attrs}">
          <v-btn
            depressed
            text
            color="white"
            class="mx-0 white--text"
            @click="logout"
            icon
            tile
            v-on="on"
            v-bind="attrs"
          >
            <v-icon large>mdi-format-horizontal-align-right</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>

    <!-- Nav -->
    <v-navigation-drawer temporary v-model="showNav" color="secondary" app class="lighten-1">
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <h2>Categories</h2>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item link @click="updateNavTag(null)">
          <v-list-item-icon>
            <v-badge color="primary lighten-2" overlap :content="notifCount" :value="notifCount">
              <v-icon large>mdi-view-grid</v-icon>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-title>
            <strong>All</strong>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="(category, index) in categories"
          :key="index"
          link
          @click="updateNavTag(category.name)"
        >
          <v-list-item-icon>
            <v-badge
              color="primary lighten-2"
              overlap
              :content="category.notifs"
              :value="category.notifs"
            >
              <v-icon large>{{category.icon}}</v-icon>
            </v-badge>
          </v-list-item-icon>

          <v-list-item-title>
            <strong>{{category.name}}</strong>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-main>
      <v-container fluid fill-height class="d-flex align-center justify-center">
        <!-- Router Content -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer padless fixed app>
      <v-card flat tile class="primary lighten-1 white--text text-center flex">
        <v-card-text class="white--text">
          <strong>Shaqeeb Momen</strong>
          —
          {{ new Date().getFullYear() }}
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Store from "@/store/index.js";
import { mapState } from "vuex";
import router from "@/router/index.js";

export default {
  name: "App",

  components: {},

  data: () => ({
    showNav: false,
  }),
  computed: {
    ...mapState(["user", "navTag", "notifCount", "categories"]),
    // user() {
    //   return Store.state.user;
    // },
    // navTag() {
    //   return Store.state.navTag;
    // },
  },

  methods: {
    toggleMenu() {
      this.showNav = !this.showNav;
    },
    async logout() {
      await Store.dispatch("logout", null);
      router.push("/");
    },
    updateNavTag(tag) {
      this.showNav = false;
      Store.dispatch("setNavTag", tag);
    },
  },
};
</script>

<style>
</style>
