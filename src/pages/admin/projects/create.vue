<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal">
    <a-card title="Tạo mới tài khoản" style="width: 100%">
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-12">
            <div class="row mb-3">
              <div class="col-12">
                <!-- Tên Dự Án -->
                <a-form-item label="Tên dự án" required>
                  <a-input
                    allow-clear
                    v-model:value="name"
                    :class="{
                      'input-danger': errors.name,
                    }"
                    placeholder="Tên dự án"
                  />
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.name" />
              </div>
              <div class="col-12 mt-3">
                <!-- Mô Tả Dự Án -->
                <a-form-item label="Mô tả dự án" required>
                  <a-textarea
                    allow-clear
                    placeholder="Mô tả dự án"
                    :class="{
                      'input-danger': errors.description,
                    }"
                    v-model:value="description"
                    :rows="4"
                  />
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.description" />
              </div>
              <div class="col-12 mt-3">
                <!-- Chọn Ngày Bắt Đầu và Kết Thúc -->
                <a-form-item label="Thời gian dự án" required>
                  <a-range-picker
                    :class="{
                      'input-danger': errors.project_date,
                    }"
                    format="DD/MM/YYYY"
                    v-model:value="project_date"
                  />
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.project_date" />
              </div>
              <div class="col-12 mt-3">
                <!-- Chọn Người Quản Lý Dự Án -->
                <a-form-item label="Người quản lý dự án" required>
                  <a-select
                    show-search
                    placeholder="Quản lý dự án"
                    style="width: 100%"
                    :options="users"
                    :filter-option="filterOption"
                    allow-clear
                    v-model:value="user_id"
                    :class="{
                      'select-danger': errors.user_id,
                    }"
                  ></a-select>
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.user_id" />
              </div>
              <div class="col-12 mt-3">
                <!-- Chọn Danh mục Dự Án -->
                <a-form-item label="Chọn Danh mục dự án" required>
                  <a-select
                    show-search
                    placeholder="Danh mục dự án"
                    style="width: 100%"
                    :options="categories"
                    :filter-option="filterOption"
                    allow-clear
                    v-model:value="category_id"
                    :class="{
                      'select-danger': errors.category_id,
                    }"
                  ></a-select>
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.category_id" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
            <!-- Nút Submit -->
            <a-form-item>
              <a-button type="primary" @click="createProjects()"
                >Tạo dự án
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button
                class="me-0 me-sm-2 mb-2 mb-sm-0"
                type="primary"
                danger
                ghost
                @click="$router.push({ name: 'admin-projects' })"
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
import { onMounted, ref, reactive, toRefs } from 'vue'
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
    store.onSelectedKeys(['admin-projects'])
    const users = ref([])
    const categories = ref([])
    const router = useRouter()
    const axiosStore = useAxiosStore()
    const token = localStorage.getItem('accessToken')

    const projects = reactive({
      project_date: [null, null],
      name: '',
      description: '',
      user_id: [],
      category_id: [],
    })

    if (token) {
      axiosStore.initializeAxios(token)
    }

    const fetchUsers = async () => {
      try {
        const response = await axiosStore.axiosInstance.get(
          '/projects/getusers',
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          }
        )
        users.value = response.data.users // Adjust if response structure differs
        categories.value = response.data.categories // Adjust if response structure differs
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
        message.error('Lỗi lấy danh sách người quản lý!')
      }
    }

    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    const createProjects = () => {
      errorStore.clearAllErrors() // Xóa toàn bộ lỗi trước đó

      // Kiểm tra tên dự án
      if (!projects.name) {
        errorStore.setError('name', 'Vui lòng nhập vào tên dự án!')
      } else if (projects.name.length < 3) {
        errorStore.setError('name', 'Tên dự án phải có ít nhất 3 ký tự!')
      }

      // Kiểm tra mô tả dự án
      if (!projects.description) {
        errorStore.setError('description', 'Vui lòng nhập mô tả dự án!')
      }

      // Kiểm tra ngày bắt đầu và ngày kết thúc
      if (!projects.project_date[0] || !projects.project_date[1]) {
        errorStore.setError(
          'project_date',
          'Vui lòng chọn ngày bắt đầu và ngày kết thúc!',
        )
      }

      // Kiểm tra người dùng (user_id)
      if (!projects.user_id || projects.user_id.length === 0) {
        errorStore.setError('user_id', 'Vui lòng chọn người quản lý dự án!')
      }
      // Kiểm tra (category_id)
      if (!projects.category_id || projects.category_id.length === 0) {
        errorStore.setError('category_id', 'Vui lòng chọn danh mục lý dự án!')
      }

      if (Object.keys(errors.value).length === 0) {
        console.log('Dữ liệu gửi:', projects) // Log dữ liệu trước khi gửi để kiểm tra
        return
        // Nếu không có lỗi thì gửi yêu cầu tạo dự án mới
        axiosStore.axiosInstance
          .post('/projects', projects, {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          })
          .then((response) => {
            if (response.status == 201) {
              message.success(response.data.message)
              router.push({ name: 'admin-projects' })
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

    // Fetch projects when component is mounted
    onMounted(fetchUsers)

    return {
      users,
      categories,
      ...toRefs(projects),
      errors,
      filterOption,
      createProjects,
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

.select-danger:hover,
.input-danger:hover {
  border-color: #d90429;
  box-shadow: 0 0 8px rgba(230, 57, 70, 0.7);
}

.select-danger:focus,
.input-danger:focus {
  outline: none; /* Remove default outline */
  border-color: #d90429;
  box-shadow: 0 0 10px rgba(230, 57, 70, 0.9);
}

/* Placeholder color for error fields */
.select-danger::placeholder,
.input-danger::placeholder {
  color: #e63946;
  opacity: 0.8;
}
</style>
