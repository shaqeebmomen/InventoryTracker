import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#37464f',
        secondary: '#64b5f6',
        accent: '#4527a0',
        error: '#d50000',
        info: '#00bfa5',
        success: '#00c853',
        warning: '#f57c00',
      }
    }
  }
});
