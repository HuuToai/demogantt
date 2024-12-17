<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal">
    <a-card title="Chỉnh sửa dự án" style="width: 100%">
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
                <a-form-item label="Danh mục dự án" required>
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

              <!-- Trạng thái hoạt động -->
              <div class="col-12 mt-3">
                <a-form-item label="Trạng thái">
                  <a-select
                    style="width: 100%"
                    v-model:value="is_active"
                    :options="[
                      { label: 'Hoạt động', value: 1 },
                      { label: 'Không hoạt động', value: 0 },
                    ]"
                  />
                </a-form-item>
              </div>
              <div class="col-12 mt-3">
                <div></div>
                <a-form-item label="Thời gian dự án">
                  <a-range-picker
                    v-model:value="project_date"
                    :format="dateFormat"
                  />
                </a-form-item>
              </div>

              <!-- Tiến độ -->

              <div class="col-12 mt-3">
                <a-form-item label="Tiến độ">
                  <a-slider
                    v-model:value="progress"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :marks="{
                      0: '0%',
                      1: '100%',
                    }"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
              <!-- Thời gian tạo và cập nhật -->
              <div class="col-12">
                <a-form-item label="Thời gian tạo">
                  <a-input disabled v-model:value="created_at" />
                </a-form-item>
                <a-form-item label="Thời gian cập nhật">
                  <a-input disabled v-model:value="updated_at" />
                </a-form-item>
              </div>

              <!-- Người dùng trong dự án -->
              <div class="col-12 mt-3">
                <a-form-item label="Người dùng trong dự án">
                  <a-table
                    :columns="columns"
                    :data-source="users_in_project"
                    rowKey="id"
                    pagination="{false}"
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
              <a-button type="primary" @click="updateProject"
                >Cập nhật dự án
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
import dayjs from 'dayjs'

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
    const dateFormat = 'YYYY/MM/DD'
    const projectId = router.currentRoute.value.params.id // Assuming the project ID is passed as route parameter

    const projects = reactive({
      project_date: [null, null],
      name: '',
      description: '',
      user_id: [],
      category_id: [],
      is_active: 1, // Default to active
      progress: 0.0,
      created_at: '',
      updated_at: '',
      users_in_project: [],
    })

    // Các khai báo dữ liệu và hàm
    const columns = [
      {
        title: 'Mã Nhân viên',
        dataIndex: 'employee_code',
        key: 'employee_code',
      },
      {
        title: 'Tên người dùng',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
    ]

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
              Accept: 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          },
        )
        users.value = response.data.users
        categories.value = response.data.categories
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
        message.error('Lỗi lấy danh sách người quản lý!')
      }
    }

    const fetchProject = async () => {
      try {
        const response = await axiosStore.axiosInstance.get(
          `/projects/${projectId}`,
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              Accept: 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          },
        )
        console.log(response)
        if (response.data) {
          // Load project data for editing
          const {
            name,
            description,
            user_id,
            category_id,
            is_active,
            progress,
            created_at,
            updated_at,
            users,
            start_date,
            end_date,
          } = response.data
          projects.name = name
          projects.description = description
          projects.user_id = user_id
          projects.category_id = category_id
          projects.is_active = is_active
          projects.progress = progress
          projects.created_at = dayjs(created_at).format('DD/MM/YYYY') // Định dạng ngày tạo
          projects.updated_at = dayjs(updated_at).format('DD/MM/YYYY') // Định dạng ngày cập nhật
          projects.project_date = ref([
            dayjs(start_date, dateFormat),
            dayjs(end_date, dateFormat),
          ])
          // Tìm user_id của người quản lý dự án (is_manager = 1)
          const manager = users.find((user) => user.pivot.is_manager === 1)
          projects.user_id = manager ? manager.id : null
          projects.users_in_project = users
          message.success('lấy dự án thành công')
        } else {
          message.warning('Không tìm thấy dự án.')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin dự án:', error)
        message.error('Lỗi khi tải dữ liệu dự án.')
      }
    }

    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const updateProject = () => {
      errorStore.clearAllErrors() // Clear previous errors
      console.log(projects)
      // return true
      if (Object.keys(errors.value).length === 0) {
        axiosStore.axiosInstance
          .put(`/projects/${projectId}`, projects, {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          })
          .then((response) => {
            if (response.status == 200) {
              message.success('Dự án đã được cập nhật thành công!')
              router.push({ name: 'admin-projects' })
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.errors) {
              const serverErrors = error.response.data.errors
              Object.keys(serverErrors).forEach((field) => {
                const errorMessage = serverErrors[field][0]
                errorStore.setError(field, errorMessage)
              })
            } else {
              message.error('Lỗi khi cập nhật dự án!')
            }
          })
      }
    }

    onMounted(() => {
      fetchUsers()
      fetchProject()
    })

    return {
      ...toRefs(projects),
      dateFormat,
      columns,
      users,
      categories,
      errors,
      fetchUsers,
      updateProject,
      fetchProject,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      filterOption,
    }
  },
}
</script>
