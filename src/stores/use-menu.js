import { defineStore } from 'pinia'

export const useMenu = defineStore('menuId', {
  state: () => ({
    selectedKeys: [],
    openKeys: [],
  }),
  actions: {
    onSelectedKeys(data){
      // console.log('Selected Keys Updated:', data);
        this.selectedKeys = data;
    },
    onOpenKeys(data){
      // console.log('Open Keys Updated:', data);
        this.openKeys = data;
    }
    
  }
})