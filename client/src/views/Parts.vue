<!-- This route will handle the display of all the parts, after the user has logged in from the HOME route -->

<template >
  <v-container fluid style="height: 75vh">
    <template v-if="cardsLoading">
      <v-row class="fill-height d-flex justify-center align-center">
        <v-progress-circular
          size="150"
          class="mx-auto"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>
    </template>
    <template v-else>
      <v-alert dense v-if="guest" type="warning" outlined>
        <h4 class="fill-height d-flex justify-center align-center">
          Welcome guest! Edits will not be saved
        </h4>
      </v-alert>
      <v-row align="center">
        <v-col cols="12">
          <!-- Filter row -->
          <v-autocomplete
            ref="filter"
            v-model="filterTags"
            :items="tagList"
            item-text="name"
            item-value="name"
            outlined
            chips
            small-chips
            label="Filters"
            multiple
            clearable
            full-width
            @change="closeCards = true"
            @blur="closeCards = false"
          >
            <!-- Slot to define the items placed in the autocomplete box -->
            <template v-slot:selection="data">
              <v-chip
                ref
                v-bind="data.attrs"
                :color="data.item.category ? 'primary' : 'secondary'"
                close
                @click="data.select"
                @click:close="removeTag(data.item)"
                >{{ data.item.name }}</v-chip
              >
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <!-- </v-container>

      <v-container>-->
      <v-row justify="start">
        <!-- Placeholder spinner for card load -->

        <!-- Card display space -->
        <v-col
          v-for="item in itemList"
          :key="item._id"
          class="col-lg-3 col-md-4 col-sm-6"
        >
          <v-sheet
            class="fill-height mx-auto"
            max-width="300px"
            min-width="250px"
          >
            <v-lazy
              :options="{
                threshold: 1,
              }"
              min-height="0"
              transition="fab-transition"
            >
              <ItemCard
                @cardActive="scrollToCard"
                :forceClose="closeCards"
                :ref="'card_' + item._id"
                :cardId="item._id"
              />
            </v-lazy>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="fill-height" style="height: 15vh"></v-col>
      </v-row>

      <!-- Floating Action Button to add card -->
      <v-dialog v-model="showCardForm" max-width="600px">
        <template v-slot:activator="{ on: dialog }">
          <v-tooltip top>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-bind="attrs"
                v-on="{ ...tooltip, ...dialog }"
                color="secondary"
                fab
                fixed
                bottom
                right
                class="mb-2"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>

            <span>Add Item</span>
          </v-tooltip>
        </template>
        <ItemForm @new-item-close="showCardForm = false" />
      </v-dialog>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary darken-1"
            fab
            fixed
            bottom
            left
            class="mb-2 white--text"
            @click="renav"
            ref="scrollBtn"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </template>
        <span>Scroll Up</span>
      </v-tooltip>

      <v-snackbar
        :color="alert.color"
        app
        v-model="showAlert"
        timeout="1500"
        bottom
      >
        {{ alert.message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showAlert = false">Close</v-btn>
        </template>
      </v-snackbar>
    </template>
  </v-container>
</template>


<script>
import { mapState } from "vuex";
import ItemCard from "@/components/ItemCard";
import ItemForm from "@/components/ItemForm";
import Store from "@/store/index";
export default {
  name: "Parts",
  components: {
    ItemCard,
    ItemForm,
  },
  data() {
    return {
      cardsLoading: false,
      filterTags: [],
      tagList: [],
      title: "The summer breeze",
      menuOpts: {
        closeOnClick: true,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 304,
      },
      closeCards: false,
      showAlert: false,
      alert: {
        message: "",
        color: "white",
      },
      showCardForm: false,
    };
  },
  computed: {
    ...mapState(["navTag", "categoryTags", "tags", "items", "guest"]),
    itemList() {
      // this.$refs.filter.$refs.menu.deactivate();
      return this.items.filter((item) => {
        let match = true;
        this.filterTags.forEach((tag) => {
          if (!item.tags.includes(tag) && !item.categories.includes(tag)) {
            match = false;
          }
        });

        return match;
      });
    },
  },
  watch: {
    navTag(newVal, oldVal) {
      this.$refs.filter.clearableCallback();
      if (newVal !== null) {
        this.$refs.filter.selectItem(
          // Finding the object from the taglist to match the nav tag
          this.tagList.find((tagItem) => {
            return tagItem.name === newVal.toLowerCase();
          })
        );
      }
    },
    filterTags() {
      this.closeCards = true;
    },
  },
  methods: {
    removeTag(item) {
      const index = this.filterTags.indexOf(item.name);
      if (index >= 0) this.filterTags.splice(index, 1);
    },
    renav() {
      this.$vuetify.goTo(0, {
        duration: 1000,
        offset: 0,
        easing: "easeInOutCubic",
      });
      this.$refs.scrollBtn.$el.blur();
    },
    scrollToCard(card) {
      this.itemList.forEach((item) => {
        if (card.cardId !== item._id) {
          this.$refs[`card_${item._id}`][0].close();
        }
      });
      setTimeout(() => {
        this.$vuetify.goTo(card, {
          duration: 300,
          offset: 50,
          easing: "easeInOutCubic",
        });
      }, 150);
    },
  },
  async beforeMount() {
    this.cardsLoading = true;
    await Store.dispatch("loadCards", null);
    this.cardsLoading = false;
  },
  mounted() {
    // Fill tag object list
    this.tags.forEach((tag) => {
      this.tagList.push({
        name: tag,
        category: this.categoryTags.includes(tag),
      });
    });

    // Load all the cards from the db
  },
};
</script>