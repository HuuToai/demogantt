<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal">
    <a-card title="Chỉnh sửa dự án" style="width: 100%">
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-12">
            <div class="row mb-3">
              <div class="col-12">
                <a-form-item label="Tên danh mục dự án" required>
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
              <div class="col-12">
                <a-form-item label="Mã màu" required>
                  <a-input
                    type="color"
                    v-model:value="color_code"
                    :class="{ 'input-danger': errors.color_code }"
                    placeholder="Chọn mã màu"
                  />
                </a-form-item>
                <div class="w-100"></div>
                <ErrorMessage :message="errors.name" />
              </div>
              <!-- Trạng thái hoạt động -->
              <div class="col-12 mt-3">
                <a-form-item label="Trạng thái">
                  <a-select
                    v-model:value="status"
                    :options="[
                      { label: 'Hoạt động', value: 1 },
                      { label: 'Không hoạt động', value: 0 },
                    ]"
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
              <a-button type="primary" @click="updateCategoryProject"
                >Cập nhật danh mục dự án
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
    store.onSelectedKeys(['admin-categories-projects'])
    const router = useRouter()
    const axiosStore = useAxiosStore()
    const token = localStorage.getItem('accessToken')
    const id = router.currentRoute.value.params.id // Assuming the project ID is passed as route parameter

    const categories = reactive({
      name: '',
      color_code: '#000', // Default color code
      status: 1,
    })
    if (token) {
      axiosStore.initializeAxios(token)
    }
    const fetchCategoryProject = async () => {
      try {
        const response = await axiosStore.axiosInstance.get(
          `/category_project/edit/${id}`,
        )
        console.log(response)
        if (response.data) {
          categories.name = response.data.name
          categories.status = response.data.status
          categories.color_code = response.data.color_code
          message.success('lấy danh mục dự án thành công')
        } else {
          message.warning('Không tìm thấy danh mục dự án.')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin danh mục dự án:', error)
        message.error('Lỗi khi tải dữ liệu danh mục dự án.')
      }
    }

    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const updateCategoryProject = () => {
      errorStore.clearAllErrors() // Clear previous errors
      // return true
      if (Object.keys(errors.value).length === 0) {
        axiosStore.axiosInstance
          .put(`/category_project/update/${id}`, categories)
          .then((response) => {
            if (response.status == 200) {
              message.success('Dự án đã được cập nhật thành công!')
              router.push({ name: 'admin-categories-projects' })
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
              message.error('Lỗi khi cập nhật danh mục dự án!')
            }
          })
      }
    }

    onMounted(() => {
      fetchCategoryProject()
    })

    return {
      ...toRefs(categories),
      errors,
      updateCategoryProject,
      fetchCategoryProject,
      filterOption,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    }
  },
}
</script>
