import { defineStore } from 'pinia';

export const useNavbarStore = defineStore('navbar', {
  state: () => ({
    isShowNav: true,
  }),
  actions: {
    toggleNav() {
      this.isShowNav = !this.isShowNav;
    },
    setNav(state) {
      this.isShowNav = state;
    },
  },
});
