import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filterStore', {
    state: () => ({
        searchQuery: '', // Chuỗi tìm kiếm
        selectedCategories: [], // Mảng lưu danh mục được chọn
    }),
    actions: {
        toggleCategory(categoryId) {
            const index = this.selectedCategories.indexOf(categoryId);
            if (index > -1) {
                // Nếu category đã có trong mảng, bỏ chọn
                this.selectedCategories.splice(index, 1);
            } else {
                // Nếu chưa có, thêm vào mảng
                this.selectedCategories.push(categoryId);
            }
        },
        setSearchQuery(query) {
            this.searchQuery = query; // Cập nhật search query
        },
    },
});
