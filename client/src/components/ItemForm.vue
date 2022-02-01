<template>
  <v-card :loading="loading">
    <v-card-title>
      <h2>Add New Item</h2>
    </v-card-title>
    <v-card-text>
      <v-form v-model="cardValid">
        <!-- NAME & DESCRIPTION -->
        <v-text-field
          ref="new-name"
          required
          label="Name"
          v-model="card.name"
          :rules="cardRules.name"
        ></v-text-field>
        <v-text-field
          ref="new-desc"
          required
          label="Description"
          v-model="card.description"
          :rules="cardRules.desc"
        ></v-text-field>
        <v-container class="pt-0">
          <!-- QTY -->
          <v-row class="d-flex justify-between align-center">
            <v-col>
              <v-btn icon color="primary" outlined @click="incrementQty(-1)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-text-field label="Qty" v-model="card.qty"></v-text-field>
            </v-col>

            <v-spacer></v-spacer>
            <v-col>
              <v-btn icon color="primary" outlined @click="incrementQty(1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-between align-center">
            <v-col>
              <v-btn icon color="primary" outlined @click="incrementWQty(-1)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-text-field label="Warning qty" v-model="card.warningQty"></v-text-field>
            </v-col>

            <v-spacer></v-spacer>
            <v-col>
              <v-btn icon color="primary" outlined @click="incrementWQty(1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <!-- CHIPS -->
            <v-autocomplete
              v-model="totalTags"
              :items="tagChips"
              item-text="name"
              item-value="name"
              fill
              chips
              small-chips
              label="Tags"
              multiple
              clearable
              full-width
              class="mt-0 pt-0 mb-1"
            >
              <template v-slot:selection="data">
                <v-chip
                  ref
                  v-bind="data.attrs"
                  :color="categoryTags.includes(data.item.name)? 'primary':'secondary'"
                  :class="categoryTags.includes(data.item.name)? 'white--text':'black--text'"
                  close
                  @click="data.select"
                  @click:close="deleteTag(data.item.name)"
                >{{ data.item.name }}</v-chip>
              </template>
            </v-autocomplete>
          </v-row>

          <!-- Resources -->

          <v-row class="d-flex justify-between align-center">
            <h2>Resources</h2>
            <v-spacer></v-spacer>
            <v-dialog persistent v-model="resourceForm" max-width="500px">
              <template v-slot:activator="{on}">
                <!-- Button to add resources -->
                <v-btn x-small outlined color="primary" icon v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <!-- Add Resource Form -->

              <v-card>
                <v-card-title>Add Resource</v-card-title>
                <v-card-text>
                  <v-form ref="resourceForm" v-model="resourceValid">
                    <v-text-field
                      ref="resName"
                      required
                      :rules="resourceRules.name"
                      label="Name"
                      v-model="newResource.name"
                    ></v-text-field>
                    <v-text-field
                      required
                      :rules="resourceRules.detail"
                      label="Detail"
                      v-model="newResource.detail"
                      hint="include 'https://' in links'"
                    ></v-text-field>
                  </v-form>
                  <v-alert
                    class="mt-3"
                    dense
                    outlined
                    v-if="duplicateResource"
                    type="error"
                  >Name must be unique</v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-btn
                          :disabled="!resourceValid || duplicateResource"
                          color="success"
                          class="mr-5"
                          @click="addResource"
                        >Save</v-btn>
                        <v-btn outlined color="error" @click="cancelAddResource">Cancel</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <v-row
            v-for="resource in card.resources"
            :key="resource.name"
            class="d-flex justify-between align-center"
          >
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                tile
                small
                class="mr-2"
                @click="removeResource(resource.name)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <strong>
                <p class="black--text d-inline">{{resource.name + ': '}}</p>
              </strong>
              <a
                class="d-inline"
                v-if="getResourceType(resource.detail) === 'link'"
                :href="resource.detail"
                target="_blank"
              >{{resource.detail}}</a>
              <p class="d-inline black--text" v-else>{{resource.detail}}</p>
            </v-col>
          </v-row>
        </v-container>
        <!-- ITEM SUBMISSION -->
        <v-row>
          <v-container>
            <v-row>
              <v-col>
                <v-btn
                  :disabled="!cardValid || duplicateCard"
                  color="success"
                  class="mr-5"
                  @click="submitItem"
                >Save</v-btn>
                <v-btn outlined color="error" @click="cancelSubmit">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-form>
      <v-alert dense outlined v-if="duplicateCard" type="error">Name must be unique</v-alert>
    </v-card-text>
    <v-snackbar :color="alert.color" app v-model="showAlert" timeout="1500" bottom>
      {{ alert.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showAlert = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import Store from "@/store/index";
export default {
  name: "ItemForm",
  data() {
    return {
      loading: false,
      cardValid: false,
      card: {
        name: "",
        description: "",
        qty: 0,
        warningQty: 0,
        categories: ["others"],
        tags: [],
        resources: [],
      },
      cardRules: {
        name: [(v) => !!v || "Name is required"],
        desc: [(v) => !!v || "Description is required"],
      },
      resourceForm: false,
      resourceValid: false,
      newResource: {
        name: "",
        detail: "",
      },
      resourceRules: {
        name: [(v) => !!v || "Name is required"],
        detail: [(v) => !!v || "Detail is required"],
      },
      showAlert: false,
      alert: {
        message: "",
        color: "white",
      },
    };
  },
  computed: {
    ...mapState(["categories", "tags", "categoryTags", "tagChips", "items"]),
    totalTags: {
      get: function () {
        return [...this.card.categories, ...this.card.tags];
      },

      set: function (val) {
        // Clear the two tag groups
        this.card.categories = [];
        this.card.tags = [];
        val.forEach((tag) => {
          // For every local tag that counts as a category, add that back to the card's categories
          if (this.categoryTags.includes(tag)) {
            this.card.categories.push(tag);
          }
          // do the same for the regular tags if we didnt already
          else if (this.tags.includes(tag)) {
            this.card.tags.push(tag);
          }
        });
        if (this.card.categories.length <= 0) {
          this.card.categories.push("others");
        }
        if (
          this.card.categories.includes("others") &&
          this.card.categories.length > 1
        ) {
          this.card.categories = _.filter(this.card.categories, (category) => {
            return category !== "others";
          });
        }
      },
    },
    duplicateResource() {
      if (this.card.resources.length > 0 && this.newResource.name) {
        return this.card.resources.some((resource) => {
          return (
            resource.name.toLowerCase() === this.newResource.name.toLowerCase()
          );
        });
      } else {
        return false;
      }
    },
    duplicateCard() {
      const card = this.card;

      if (card.name && this.items.length > 0) {
        return this.items.some((item) => {
          return item.name.toLowerCase() === this.card.name.toLowerCase();
        });
      } else {
        return false;
      }
    },
  },
  methods: {
    incrementQty(val) {
      this.card.qty += val;
      if (this.card.qty < 0) {
        this.card.qty = 0;
      }
    },
    incrementWQty(val) {
      this.card.warningQty += val;
      if (this.card.warningQty < 0) {
        this.card.warningQty = 0;
      }
    },
    getResourceType(resource) {
      if (resource.includes("https://www") || resource.includes("http://www")) {
        return "link";
      } else {
        return "text";
      }
    },
    resetNewResource() {
      this.newResource = {
        name: null,
        detail: null,
      };
    },
    addResource() {
      this.card.resources.push(this.newResource);

      this.resourceForm = false;
      this.resetNewResource();
    },
    cancelAddResource() {
      this.resourceForm = false;
      this.resetNewResource();
    },
    removeResource(name) {
      this.card.resources = _.filter(this.card.resources, (res) => {
        return res.name !== name;
      });
    },
    async submitItem() {
      try {
        this.loading = true;
        await Store.dispatch("addCard", this.card);

        // Emit event to close form
        this.$emit("new-item-close");
      } catch (error) {
        this.alert.message = `Error Updating ${this.card.name}`;
        this.alert.color = "error";
        this.showAlert = true;
        console.log(error);
      }
      this.loading = false;
    },
    cancelSubmit() {
      this.card = {
        name: "",
        description: "",
        qty: 0,
        warningQty: 0,
        categories: [],
        tags: ["others"],
        resources: [],
      };
      this.loading = false;
      this.resetNewResource();
      this.$emit("new-item-close");
    },
  },
};
</script>

<style>
</style>