<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal">
    <a-card title="Danh mục dự án" style="width: 100%">
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-12">
            <div class="row mb-3">
              <div class="col-12">
                <!-- Tên Dự Án -->
                <a-form-item label="Tên danh mục dự án" required>
                  <a-input
                    allow-clear
                    v-model:value="name"
                    :class="{
                      'input-danger': errors.name,
                    }"
                    placeholder="Tên danh mục dự án"
                  />
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.name" />
              </div>
              <div class="col-12">
                <a-form-item label="Mã màu" required>
                  <a-input
                    type="color"
                    v-model:value="color_code"
                    :class="{ 'input-danger': errors.color_code }"
                    placeholder="Chọn mã màu"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
            <!-- Nút Submit -->
            <a-form-item>
              <a-button type="primary" @click="createCategoryProjects()"
                >Tạo danh mục dự án
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button
                class="me-0 me-sm-2 mb-2 mb-sm-0"
                type="primary"
                danger
                ghost
                @click="$router.push({ name: 'admin-categories-projects' })"
              >
                <span>Hủy</span>
              </a-button>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-card>
  </a-form>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { useMenu } from '../../../stores/use-menu.js'
import { useRouter } from 'vue-router'
import useAxiosStore from '../../../stores/use-axios'
import { useErrorStore } from '../../../stores/use-erorrs.js'
import ErrorMessage from '../../../components/ErrorMessage.vue'
import { computed } from 'vue'
export default {
  components: { ErrorMessage },
  setup() {
    const errorStore = useErrorStore()
    const errors = computed(() => errorStore.errors)
    const store = useMenu()
    store.onSelectedKeys(['admin-categories-projects'])
    const router = useRouter()
    const axiosStore = useAxiosStore()
    const token = localStorage.getItem('accessToken')

    const categories = reactive({
      name: '',
      color_code: '#000',
    })

    if (token) {
      axiosStore.initializeAxios(token)
    }
    const createCategoryProjects = () => {
      errorStore.clearAllErrors() // Xóa toàn bộ lỗi trước đó

      // Kiểm tra tên dự án
      if (!categories.name) {
        errorStore.setError('name', 'Vui lòng nhập vào tên danh mục dự án!')
      }
      // if (!categories.color_code) {
      //   errorStore.setError('color_code', 'Vui lòng nhập vào mã màu!')
      // }

      if (Object.keys(errors.value).length === 0) {
        // Nếu không có lỗi thì gửi yêu cầu tạo dự án mới
        axiosStore.axiosInstance
          .post('/category_project/store', categories)
          .then((response) => {
            if (response.status == 201) {
              message.success(response.data.message)
              router.push({ name: 'admin-categories-projects' })
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.errors) {
              // Lấy các lỗi từ phản hồi server
              const serverErrors = error.response.data.errors

              // Duyệt qua từng trường bị lỗi và set vào errorStore
              Object.keys(serverErrors).forEach((field) => {
                // Lấy thông báo lỗi đầu tiên từ mảng lỗi của trường
                const errorMessage = serverErrors[field][0]
                errorStore.setError(field, errorMessage) // Đặt lỗi vào store
              })
            } else {
              // Xử lý lỗi chung nếu server không trả về cấu trúc lỗi mong đợi
              console.log(error.response.data.message)
              message.error('Có lỗi xảy ra khi tạo mới dự án')
            }
          })
      }
    }
    return {
      ...toRefs(categories),
      errors,
      createCategoryProjects,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    }
  },
}
</script>

<style scoped>
/* Add custom styles for errors */
.select-danger,
.input-danger {
  border: 2px solid #e63946; /* Red border for error */
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 0 5px rgba(230, 57, 70, 0.5); /* Red shadow */
  transition: all 0.3s ease; /* Smooth transition */
}

.spectrum {
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>