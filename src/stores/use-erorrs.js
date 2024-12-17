import { defineStore } from 'pinia';

export const useErrorStore = defineStore('errorStore', {
  state: () => ({
    errors: {}, // Lưu lỗi dưới dạng key-value (fieldName: message)
  }),
  actions: {
    setError(field, message) {
      this.errors[field] = message;
    },
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },
    clearAllErrors() {
      this.errors = {};
    },
  },
});
