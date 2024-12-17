<template>
  <a-card title="Tài khoản" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <a-button type="primary">
          <router-link :to="{ name: 'users-register' }">
            <i class="fa-solid fa-user-plus"></i>
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- scroll khi màn hình bé quá 576  -->
        <a-table
          :dataSource="users"
          :columns="columns"
          :scroll="{ x: 576 }"
          :loading="loading"
          :locale="{ emptyText: 'Chưa có người dùng nào trong hệ thống' }"
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

            <template v-if="column.key === 'action'">
              <router-link
                :to="{ name: 'admin-users-edit', params: { id: record.id } }"
              >
                <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0">
                  <i class="fa-regular fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button type="primary" danger @click="confirmDelete(record.id)">
                <i class="fa-solid fa-trash"></i>
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
import useAxiosStore from '../../../stores/use-axios'

export default defineComponent({
  created() {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  setup() {
    const store = useMenu()
    store.onSelectedKeys(['admin-users'])

    const users = ref(null) // Ban đầu là null để xử lý loading
    const loading = ref(false) // Thêm biến loading

    const columns = [
      { title: '#', key: 'index' },
      {
        title: 'Mã nhân viên',
        key: 'employee_code',
        dataIndex: 'employee_code',
      },
      { title: 'Tài khoản', dataIndex: 'name', key: 'name' },
      { title: 'email', dataIndex: 'email', key: 'email' },
      {
        title: 'Thêm bởi',
        dataIndex: 'created_by_name',
        key: 'created_by_name',
      },
      { title: 'Trạng thái tài khoản', key: 'is_active' },
      {
        title: 'Phòng ban',
        dataIndex: 'name_department',
        key: 'name_department',
      },
      { title: 'Công cụ', key: 'action', fixed: 'right' },
    ]

    const axiosStore = useAxiosStore()

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }

    const getUsers = async () => {
      loading.value = true // Bắt đầu loading
      try {
        const response = await axiosStore.axiosInstance.get('/users')
        users.value = response.data.length ? response.data : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng
        // Xử lý khi thành công
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu người dùng')
      } finally {
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }

    // Hàm xử lý xóa user
    const deleteUser = (id) => {
      axiosStore.axiosInstance
        .delete(`/users/delete/${id}`)
        .then((response) => {
          if (response.status === 200) {
            message.success('Xóa người dùng thành công')
            getUsers() // Cập nhật lại danh sách người dùng
          }
        })
        .catch((error) => {
          console.log(error)
          message.error('Xóa người dùng thất bại')
        })
    }

    // Xác nhận trước khi xóa
    const confirmDelete = (id) => {
      Modal.confirm({
        title: 'Bạn có chắc chắn muốn xóa người dùng này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          deleteUser(id)
        },
      })
    }
    onMounted(() => {
      getUsers()
    })
    return {
      users,
      columns,
      confirmDelete, // Xuất hàm xóa để sử dụng trong template
      loading, // Xuất biến loading để kiểm soát trạng thái loading
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