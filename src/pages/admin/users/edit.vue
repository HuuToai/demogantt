<template>
  <form @submit.prevent="updateUser()">
    <a-card title="Cập nhật tài khoản" style="width: 100%">
      <div class="row">
        <div class="col-12 col-sm-4">
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img src="../../../assets/user.png" alt="avatar" />
                </template>
              </a-avatar>
            </div>
            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary">
                <i class="fa-solid fa-plus me-2"></i>
                <span>Chọn ảnh</span>
              </a-button>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-8">
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.name,
                  }"
                >
                  Tên tài khoản
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                required
                placeholder="Tên tài khoản"
                allow-clear
                v-model:value="name"
                :class="{
                  'input-danger': errors.name,
                }"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.name" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.email,
                  }"
                >
                  Email
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Email"
                allow-clear
                required
                id="email"
                v-model:value="email"
                :class="{
                  'input-danger': errors.email,
                }"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.email" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.department_id,
                  }"
                >
                  Phòng ban</span
                >
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-select
                show-search
                placeholder="Phòng ban"
                style="width: 100%"
                :options="departments"
                :filter-option="filterOption"
                allow-clear
                v-model:value="department_id"
                :class="{
                  'select-danger': errors.department_id,
                }"
              ></a-select>

              <div class="w-100"></div>
              <ErrorMessage :message="errors.department_id" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.is_active,
                  }"
                >
                  Trạng thái</span
                >
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-select
                show-search
                placeholder="Trạng thái"
                style="width: 100%"
                :options="status"
                :filter-option="filterOption"
                allow-clear
                v-model:value="is_active"
                :class="{
                  'select-danger': errors.is_active,
                }"
              ></a-select>

              <div class="w-100"></div>
              <ErrorMessage :message="errors.is_active" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end"></div>
            <div class="col-12 col-sm-5">
              <a-checkbox v-model:checked="change_password">
                Đổi mật khẩu
              </a-checkbox>
            </div>
          </div>

          <div class="row mb-3" v-if="change_password == true">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.password,
                  }"
                >
                  Mật khẩu
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                allow-clear
                v-model:value="password"
                :class="{
                  'input-danger': errors.password,
                }"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.password" />
            </div>
          </div>
          <div class="row mb-3" v-if="change_password == true">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span
                  :class="{
                    'text-danger': errors.password_confirmation,
                  }"
                >
                  Xác nhận mật khẩu
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                allow-clear
                v-model:value="password_confirmation"
                :class="{
                  'input-danger': errors.password_confirmation,
                }"
              />
              <div class="w-100"></div>
              <ErrorMessage :message="errors.password_confirmation" />
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
            @click="$router.push({ name: 'admin-users' })"
          >
            <span>Hủy</span>
          </a-button>
          <a-button type="primary" html-type="submit">
            <span>Cập nhật</span>
          </a-button>
        </div>
      </div>
    </a-card>
  </form>
</template>
  
  <script>
import { defineComponent, ref, reactive, toRefs } from "vue";
import { message } from "ant-design-vue";
import { useMenu } from "../../../stores/use-menu.js";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import useAxiosStore from "../../../stores/use-axios";
import ErrorMessage from "../../../components/ErrorMessage.vue";
import { useErrorStore } from "../../../stores/use-erorrs.js";
import { computed } from "vue";

export default defineComponent({
  components: { ErrorMessage },

  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users"]);
    const router = useRouter();
    const route = useRoute();
    const departments = ref([]);
    const status = ref([]);
    const errorStore = useErrorStore();
    const errors = computed(() => errorStore.errors);
    const users = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      department_id: [],
      is_active: [],
      change_password: false,
    });

    const token = localStorage.getItem("accessToken");
    const axiosStore = useAxiosStore();
    if (token) {
      axiosStore.initializeAxios(token);
    }
    const getUsers = async () => {
      try {
        const response = await axiosStore.axiosInstance.get(
          `/users/edit/${route.params.id}`
        );
        users.name = response.data.user.name;
        users.email = response.data.user.email;
        users.is_active = response.data.user.is_active;
        users.department_id = response.data.user.department_id;
        departments.value = response.data.departments;
        // Tạo mảng status với value và label
        status.value = [
          { value: 1, label: "Kích hoạt" },
          { value: 0, label: "Khóa" },
        ];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    const updateUser = () => {
      // Xóa tất cả lỗi trước khi kiểm tra lại
      errorStore.clearAllErrors();

      // Kiểm tra Email
      if (!users.email) {
        errorStore.setError("email", "Vui lòng nhập vào Email!");
      } else if (!/\S+@\S+\.\S+/.test(users.email)) {
        errorStore.setError("email", "Email không hợp lệ!");
      }
      if (users.change_password) {
        // Kiểm tra mật khẩu
        if (!users.password) {
          errorStore.setError("password", "Vui lòng nhập vào mật khẩu!");
        } else if (users.password.length < 8) {
          errorStore.setError("password", "Mật khẩu phải có ít nhất 8 ký tự!");
        }
        // Kiểm tra xác nhận mật khẩu
        if (!users.password_confirmation) {
          errorStore.setError(
            "password_confirmation",
            "Vui lòng nhập vào xác nhận mật khẩu!"
          );
        } else if (users.password !== users.password_confirmation) {
          errorStore.setError(
            "password_confirmation",
            "Mật khẩu và xác nhận mật khẩu không khớp!"
          );
        }
      }
      // Kiểm tra tên người dùng
      if (!users.name) {
        errorStore.setError("name", "Vui lòng nhập tên tài khoản!");
      } else if (users.name.length < 3) {
        errorStore.setError("name", "Tên tài khoản phải có ít nhất 3 ký tự!");
      }

      // Kiểm tra nếu có lỗi nào đã được lưu trong errorStore
      if (Object.keys(errorStore.errors).length > 0) {
        return; // Nếu có lỗi, không tiếp tục gửi yêu cầu
      }
      axiosStore.axiosInstance
        .put(`/users/update/${route.params.id}`, users)
        .then((response) => {
          if (response.status == 200) {
            message.success("Cập nhật thành công");
            router.push({ name: "admin-users" });
          }
        })
        .catch((error) => {
          // Lấy các lỗi từ phản hồi server
          const serverErrors = error.response.data.errors;

          // Duyệt qua từng trường bị lỗi và set vào errorStore
          Object.keys(serverErrors).forEach((field) => {
            // Lấy thông báo lỗi đầu tiên từ mảng lỗi của trường
            const errorMessage = serverErrors[field][0];
            errorStore.setError(field, errorMessage); // Đặt lỗi vào store
          });
        });
    };
    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    // Gửi request khi component được mount
    onMounted(() => {
      getUsers();
    });
    return {
      departments,
      ...toRefs(users),
      errors,
      status,

      filterOption,
      updateUser,
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
  