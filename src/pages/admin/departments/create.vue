<template>
  <form @submit.prevent="createDepartmenst()">
    <a-card title="Tạo mới tài khoản" style="width: 100%">
      <div class="row">
        <div class="col-12 col-sm-12">
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.code,
                  }"
                >
                  Mã Phòng ban
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                required
                placeholder="Mã Phòng ban"
                allow-clear
                v-model:value="code"
                :class="{
                  'input-danger': errors.code,
                }"
                @input="uppercaseCode"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.code" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.description,
                  }"
                >
                  Tên phòng ban
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Tên phòng ban"
                allow-clear
                required
                v-model:value="description"
                :class="{
                  'input-danger': errors.description,
                }"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.description" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <a-button
            class="me-0 me-sm-2 mb-2 mb-sm-0"
            type="primary"
            danger
            ghost
            @click="$router.push({ name: 'admin-deparments' })"
          >
            <span>Hủy</span>
          </a-button>
          <a-button type="primary" html-type="submit">
            <span>Lưu</span>
          </a-button>
        </div>
      </div>
    </a-card>
  </form>
</template>
  <script>
import { defineComponent, reactive, toRefs } from "vue";
import { message } from "ant-design-vue";
import { useMenu } from "../../../stores/use-menu.js";
import { useRouter } from "vue-router";
import useAxiosStore from "../../../stores/use-axios";
import ErrorMessage from "../../../components/ErrorMessage.vue";
import { useErrorStore } from "../../../stores/use-erorrs.js";
import { computed } from "vue";

export default defineComponent({
  components: { ErrorMessage },

  setup() {
    const errorStore = useErrorStore();
    const errors = computed(() => errorStore.errors);

    const store = useMenu();
    store.onSelectedKeys(["admin-departments"]);
    const router = useRouter();

    const departments = reactive({
      code: '',
      description: '',
    })

    const token = localStorage.getItem("accessToken");
    const axiosStore = useAxiosStore();
    if (token) {
      axiosStore.initializeAxios(token);
    }

    const createDepartmenst = () => {
      errorStore.clearAllErrors(); // Xóa toàn bộ lỗi trước đó
        axiosStore.axiosInstance
          .post("/departments/store", departments)
          .then((response) => {
            if (response.status == 201) {
              message.success(response.data.message);
              router.push({ name: "admin-departments" });
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.errors) {
              // Lấy các lỗi từ phản hồi server
              const serverErrors = error.response.data.errors;

              // Duyệt qua từng trường bị lỗi và set vào errorStore
              Object.keys(serverErrors).forEach((field) => {
                // Lấy thông báo lỗi đầu tiên từ mảng lỗi của trường
                const errorMessage = serverErrors[field][0];
                errorStore.setError(field, errorMessage); // Đặt lỗi vào store
              });
            } else {
              // Xử lý lỗi chung nếu server không trả về cấu trúc lỗi mong đợi
              message.error(error.response.data.message);
            }
          });
    };
    return {
      ...toRefs(departments),
      errors,
      createDepartmenst,
    };
  },
});
</script>
  
  <style>
/* Đường viền đỏ với góc bo tròn */
.select-danger,
.input-danger {
  border: 2px solid #e63946; /* Màu đỏ nổi bật */
  border-radius: 5px; /* Góc bo tròn */
  box-shadow: 0 0 5px rgba(230, 57, 70, 0.5); /* Hiệu ứng đổ bóng */
  transition: all 0.3s ease; /* Hiệu ứng mượt */
}

/* Hiệu ứng khi người dùng di chuột qua */
.select-danger:hover,
.input-danger:hover {
  border-color: #d90429;
  box-shadow: 0 0 8px rgba(230, 57, 70, 0.7);
}

/* Hiệu ứng khi phần tử được focus */
.select-danger:focus,
.input-danger:focus {
  outline: none; /* Loại bỏ viền mặc định */
  border-color: #d90429;
  box-shadow: 0 0 10px rgba(230, 57, 70, 0.9);
}

/* Nội dung Placeholder màu đỏ nhạt */
.select-danger::placeholder,
.input-danger::placeholder {
  color: #e63946;
  opacity: 0.8;
}
</style>
  