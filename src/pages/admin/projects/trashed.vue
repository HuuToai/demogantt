<template>
  <a-card title="Danh sách dự án đã bị xóa" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <router-link :to="{ name: 'admin-projects' }">
          <a-button class="me-2" type="primary">
            <i class="fa-solid fa-list-ul"></i>
          </a-button>
        </router-link>
        <router-link :to="{ name: 'admin-projects-create' }">
          <a-button class="me-2" type="primary">
            <i class="fa-solid fa-plus"></i>
          </a-button>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- scroll khi màn hình bé quá 576  -->
        <a-table
          :dataSource="projects"
          :columns="columns"
          :scroll="{ x: 576 }"
          :loading="loading"
          :locale="{ emptyText: 'Chưa có bản ghi nào trong hệ thống' }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>

            <template v-if="column.key === 'is_active'">
              <span v-if="record.is_active == 1" class="text-primary">
                Kích hoạt
              </span>
              <span v-else-if="record.is_active !== 1" class="text-danger">
                Bị khóa
              </span>
            </template>
            <!-- Display creator -->
            <template v-if="column.key === 'created_by'">
              <span>{{ record.creator ? record.creator.name : 'N/A' }}</span>
            </template>

            <!-- Display updater -->
            <template v-if="column.key === 'updated_by'">
              <span>{{ record.updater ? record.updater.name : 'N/A' }}</span>
            </template>

            <!-- Display project manager -->
            <template v-if="column.key === 'manager'">
              <span>
                {{
                  getManager(record.users)
                    ? getManager(record.users).name
                    : 'N/A'
                }}
              </span>
            </template>

            <template v-if="column.key === 'action'">
              <a-button
                type="primary"
                danger
                @click="confirmRestore(record.id)"
              >
                <i class="fa-solid fa-trash-can-arrow-up"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useMenu } from '../../../stores/use-menu.js'
import { Modal, message } from 'ant-design-vue'
import useAxiosStore from '../../../stores/use-axios.js'

export default defineComponent({
  created() {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  setup() {
    const store = useMenu()
    store.onSelectedKeys(['admin-projects'])

    const projects = ref(null) // Ban đầu là null để xử lý loading
    const loading = ref(false) // Thêm biến loading

    const columns = [
      { title: '#', key: 'index' },
      { title: 'Tên dự án', key: 'name', dataIndex: 'name' },
      { title: 'Mô tả', dataIndex: 'description', key: 'description' },
      { title: 'Thời lượng', dataIndex: 'duration', key: 'duration' },
      { title: 'Tiến độ', dataIndex: 'progress', key: 'progress' },
      { title: 'Người tạo', key: 'created_by' },
      { title: 'Người cập nhật', key: 'updated_by' },
      { title: 'Người quản lý', key: 'manager' },
      { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
      { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
      { title: 'Trạng thái dự án', key: 'is_active' },
      { title: 'Công cụ', key: 'action', fixed: 'right' },
    ]

    const axiosStore = useAxiosStore()

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }

    const getProjects = async () => {
      loading.value = true // Bắt đầu loading
      try {
        const response = await axiosStore.axiosInstance.get(
          '/projects/trashed',
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              Accept: 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          },
        )
        projects.value = response.data.data.length ? response.data.data : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng
        console.log(response)
        // Xử lý khi thành công
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu!')
      } finally {
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }

    // Hàm lấy manager từ danh sách users
    const getManager = (users) => {
      return users.find((user) => user.pivot.is_manager === 1) || null
    }

    // Hàm xử lý khôi phục dự án
    const restoreProject = (id) => {
      axiosStore.axiosInstance
        .patch(`/projects/${id}/restore`, {
          headers: {
            'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
            'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
          },
        }) // Giả sử bạn có endpoint cho việc khôi phục
        .then((response) => {
          if (response.status === 200) {
            message.success('Khôi phục dự án thành công!')
            getProjects() // Cập nhật lại danh sách dự án
          }
        })
        .catch((error) => {
          console.log(error)
          message.error('Khôi phục dự án thất bại')
        })
    }

    // Xác nhận trước khi khôi phục
    const confirmRestore = (id) => {
      Modal.confirm({
        title: 'Bạn có muốn khôi phục dự án này không?',
        okText: 'Khôi phục',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          restoreProject(id)
        },
      })
    }
    onMounted(() => {
      getProjects()
    })
    return {
      projects,
      columns,
      confirmRestore, // Xuất hàm xóa để sử dụng trong template
      loading, // Xuất biến loading để kiểm soát trạng thái loading
      getManager,
    }
  },
})
</script>

<style>
.text-primary {
  color: #007bff; /* Xanh */
}

.text-danger {
  color: #dc3545; /* Đỏ */
}
</style>
