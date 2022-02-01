<template  >
  <v-card class="mx-auto px-1" elevation="2" outlined :loading="loading">
    <!-- TITLE -->
    <template v-if="!readOnly">
      <v-container class="mx-1">
        <v-text-field label="Name" v-model="cardData.name" @keydown.enter="toggleEdit"></v-text-field>
      </v-container>
    </template>

    <v-card-title v-else class="py-2">
      <h3 :class="warning?'warning--text' : 'black--text'">{{cardData.name}}</h3>

      <v-spacer></v-spacer>
      <v-icon
        color="secondary"
        class="mr-2"
      >{{categories.find(category => {return category.name.toLowerCase() === cardData.categories[0]}).icon}}</v-icon>
    </v-card-title>
    <v-divider></v-divider>

    <!-- DESCRIPTION -->
    <template v-if="!readOnly">
      <v-container class="mx-1">
        <v-text-field label="Desc" v-model="cardData.description" @keydown.enter="toggleEdit"></v-text-field>
      </v-container>
    </template>
    <v-card-subtitle v-else>{{cardData.description}}</v-card-subtitle>

    <!-- QTY CHANGER -->

    <v-card-actions>
      <v-container>
        <!-- QTY -->
        <v-row class="d-flex justify-between align-center">
          <v-col v-if="readOnly">
            <h3 :class="warning?'warning--text' : 'black--text'">Qty:</h3>
          </v-col>

          <v-spacer></v-spacer>
          <v-col>
            <v-btn
              icon
              small
              :color=" warning? 'warning' : 'primary'"
              outlined
              @click="incrementQty(-1)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-col>

          <v-spacer></v-spacer>
          <v-col :cols="readOnly? '': '6'">
            <template v-if="!readOnly">
              <v-text-field
                label="Qty"
                :color="warning?'warning--text' : 'black--text'"
                v-model="cardData.qty"
                @keydown.enter="toggleEdit"
              ></v-text-field>
            </template>
            <template v-else>
              <h4 :class="{'warning--text':warning }">{{this.cardData.qty}}</h4>
            </template>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn
              icon
              small
              :color=" warning? 'warning' : 'primary'"
              outlined
              @click="incrementQty(1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card-actions>

    <!-- EXPANDER -->
    <v-card-actions>
      <v-btn tile outlined color="primary" style="width:100%" icon @click="expanded = !expanded">
        Details
        <v-spacer></v-spacer>
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <!-- EXPAND CONTENT -->
    <v-expand-transition>
      <div v-show="expanded">
        <v-divider></v-divider>

        <v-card-text>
          <!-- Warning QTY -->
          <v-container>
            <v-row class="d-flex justify-between align-center my-2">
              <v-col v-if="readOnly">
                <h3 class="warning--text">Low Qty:</h3>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-btn icon small color="warning" outlined @click="incrementWQty(-1)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col :cols="readOnly? '' : '6'">
                <template v-if="!readOnly">
                  <!-- <v-container class="mx-1"> -->
                  <v-text-field
                    label="Warning Qty"
                    :color="warning?'warning--text' : 'black--text'"
                    v-model="cardData.warningQty"
                    @keydown.enter="toggleEdit"
                  ></v-text-field>
                  <!-- </v-container> -->
                </template>
                <template v-else>
                  <h4 class="warning--text">{{this.cardData.warningQty}}</h4>
                </template>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-btn icon small color="warning" outlined @click="incrementWQty(1)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>

          <!-- TAGS -->
          <template v-if="!readOnly">
            <v-container class="mx-1">
              <v-autocomplete
                v-model="totalTags"
                :items="tagChips"
                item-text="name"
                item-value="name"
                fill
                chips
                small-chips
                label="tags"
                multiple
                clearable
                full-width
              >
                <!-- Slot to define the items placed in the autocomplete box -->
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
            </v-container>
          </template>
          <v-chip-group v-else column active-class class="mb-2">
            <v-chip
              @click:close="deleteTag(tag)"
              v-for="tag in totalTags"
              :key="tag"
              :color="cardData.categories.includes(tag)? 'primary':'secondary'"
              :class="cardData.categories.includes(tag)? 'white--text':'black--text'"
            >{{tag}}</v-chip>
          </v-chip-group>

          <!-- RESOURCES  -->
          <v-container>
            <v-row class="d-flex justify-between align-center">
              <h3>Resources</h3>
              <v-spacer></v-spacer>
              <v-dialog persistent v-model="resourceForm" v-if="!readOnly" max-width="500px">
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
                    <v-alert dense outlined v-if="!uniqueResource" type="error">Name must be unique</v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-btn
                            :disabled="!resourceValid || !uniqueResource"
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
          </v-container>

          <template v-if="readOnly">
            <div v-for="resource in cardData.resources" :key="resource.name" class="mb-0">
              <strong>
                <p class="d-inline black--text">{{resource.name + ': '}}</p>
              </strong>
              <a
                class="d-inline"
                v-if="getResourceType(resource.detail) === 'link'"
                :href="resource.detail"
                target="_blank"
              >{{resource.detail}}</a>
              <p class="d-inline black--text" v-else>{{resource.detail}}</p>
            </div>
          </template>
          <template v-else>
            <v-container>
              <v-row
                class="d-flex justify-between align-center"
                v-for="resource in cardData.resources"
                :key="resource.name"
              >
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

                <v-text-field :label="resource.name" v-model="resource.detail"></v-text-field>
              </v-row>
            </v-container>
          </template>
        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- EDITING CONTROLS -->
    <v-card-actions class="mt-0">
      <v-btn outlined color="error" @click="deleteCard">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :color=" readOnly? 'primary' : 'success'" :outlined="!readOnly" @click="toggleEdit">
        <v-icon>{{readOnly? 'mdi-pencil' : 'mdi-content-save'}}</v-icon>
      </v-btn>
    </v-card-actions>
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
import _ from "lodash";
import Vue from "vue";

export default {
  name: "ItemCard",
  props: ["cardId", "forceClose"],
  data: () => ({
    loading: false,
    expanded: false,
    readOnly: true,
    // Resource Form data
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
  }),
  computed: {
    ...mapState(["items", "categories", "tags", "categoryTags", "tagChips"]),
    cardData() {
      return this.items.find((item) => {
        return item._id == this.cardId;
      });
    },
    warning() {
      const qty = this.cardData.qty;
      const warningQty = this.cardData.warningQty;
      return qty <= warningQty;
    },
    totalTags: {
      get: function () {
        return [...this.cardData.categories, ...this.cardData.tags];
      },

      set: function (val) {
        // Clear the two tag groups
        this.cardData.categories = [];
        this.cardData.tags = [];
        val.forEach((tag) => {
          // For every local tag that counts as a category, add that back to the card's categories
          if (this.categoryTags.includes(tag)) {
            this.cardData.categories.push(tag);
          }
          // do the same for the regular tags if we didnt already
          else if (this.tags.includes(tag)) {
            this.cardData.tags.push(tag);
          }
        });
        if (this.cardData.categories.length <= 0) {
          this.cardData.categories.push("others");
        }
        if (
          this.cardData.categories.includes("others") &&
          this.cardData.categories.length > 1
        ) {
          this.cardData.categories = _.filter(
            this.cardData.categories,
            (category) => {
              return category !== "others";
            }
          );
        }
      },
    },
    uniqueResource() {
      if (this.cardData.resources.length > 0 && this.newResource.name) {
        return this.cardData.resources.some((resource) => {
          return (
            resource.name.toLowerCase() !== this.newResource.name.toLowerCase()
          );
        });
      } else {
        return true;
      }
    },
  },
  watch: {
    forceClose(newVal, oldVal) {
      if (newVal) {
        this.expanded = false;
        this.updateCard();
      }
    },
    expanded(newVal, oldVal) {
      if (newVal) {
        this.$emit("cardActive", this);
      } else {
        // Close if we were editing
        if (!this.readOnly) {
          this.toggleEdit();
        }
      }
    },
    showAlert(newVal, oldVal) {
      if (!newVal) {
        this.readOnly = true;
      }
    },
  },
  methods: {
    getResourceType(resource) {
      if (resource.includes("https://www") || resource.includes("http://www")) {
        return "link";
      } else {
        return "text";
      }
    },
    toggleExpand() {
      this.expanded = !this.expanded;
    },
    close() {
      this.expanded = false;
      if (!this.readOnly) {
        this.toggleEdit();
      }
    },
    async toggleEdit() {
      if (!this.readOnly) {
        // Was editing, now need to save
        // Save data changes
        try {
          await this.updateCard();
          this.readOnly = true;
          this.expanded = false;
        } catch (error) {}
      } else {
        this.readOnly = !this.readOnly;
      }
    },
    incrementQty(val) {
      this.cardData.qty = parseInt(this.cardData.qty) + parseInt(val);
      if (this.cardData.qty <= 0) {
        this.cardData.qty = 0;
      }
      this.updateCard();
    },
    incrementWQty(val) {
      this.cardData.warningQty = parseInt(this.cardData.warningQty) + parseInt(val);
      if (this.cardData.warningQty <= 0) {
        this.cardData.warningQty = 0;
      }
      this.updateCard();
    },
    // RESOURCE METHODS
    resetNewResource() {
      this.newResource = {
        name: "",
        detail: "",
      };
    },
    addResource() {
      this.cardData.resources.push(this.newResource);
      this.resetNewResource();

      this.updateCard();

      this.resourceForm = false;
    },
    cancelAddResource() {
      this.resetNewResource();
      this.resourceForm = false;
    },
    removeResource(name) {
      this.cardData.resources = _.filter(this.cardData.resources, (res) => {
        return res.name !== name;
      });
    },
    updateCard: _.debounce(
      async function () {
        try {
          console.log("updating card");
          this.loading = true;
          await Store.dispatch("updateCard", this.cardData);
        } catch (error) {
          this.alert.message = `Error Updating ${this.cardData.name}`;
          this.alert.color = "error";
          this.showAlert = true;
        }
        this.loading = false;
      },
      500,
      {
        trailing: true,
      }
    ),
    deleteTag(tag) {
      if (this.categoryTags.includes(tag)) {
        _.remove(this.cardData.categories, (category) => {
          return category === tag;
        });
      } else if (this.tags.includes(tag)) {
        _.remove(this.cardData.tags, (cardTag) => {
          return cardTag === tag;
        });
      }

      // this.totalTags = [...updatedCategories, ...updatedTags];
      this.totalTags = [...this.cardData.categories, ...this.cardData.tags];
    },
    async deleteCard() {
      console.log("deletingCard");

      try {
        const sentName = this.cardData.name;
        await Store.dispatch("removeCard", this.cardData._id);
      } catch (error) {
        this.alert.message = `Error deleting ${this.cardData.name}`;
        this.alert.color = "error";
        this.showAlert = true;
        console.log(error);
      }
    },
  },
};
</script>

<style >
</style>