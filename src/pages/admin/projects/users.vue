<template>
  <a-card title="Danh sách nhân viên trong dự án" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <a-button
          class="me-2"
          type="primary"
          title="Thêm nhân viên vào dự án"
          @click="showAddUserModal"
        >
          <i class="fa-solid fa-plus"></i> Thêm nhân viên
        </a-button>
      </div>
    </div>
    <a-modal
      v-model:visible="addUserModalVisible"
      title="Thêm nhân viên vào dự án"
      ok-text="Thêm"
      cancel-text="Hủy"
      @ok="addUserToProject"
      :confirmLoading="addUserLoading"
    >
      <a-select
        v-model:value="selectedUserId"
        style="width: 100%"
        placeholder="Chọn nhân viên"
        :options="availableUsers"
        :loading="loadingUsers"
        allowClear
        mode="multiple"
      />
    </a-modal>
    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="users"
          :columns="columns"
          :scroll="{ x: 576 }"
          :loading="loading"
          :locale="{ emptyText: 'Chưa có bản ghi nào trong hệ thống' }"
          :pagination="{ pageSize: 5 }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.key === 'is_manager'">
              <span v-if="record.is_manager == 1" class="text-primary">
                Quản lý
              </span>
              <span v-else-if="record.is_manager !== 1" class="text-danger">
                Nhân viên
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                class="me-2"
                type="primary"
                @click="assignManager(record.id)"
                v-if="!record.is_manager"
              >
                <i class="fa-solid fa-user-tie"></i> Chỉ định làm quản lý
              </a-button>
              <a-button
                class="me-2"
                type="default"
                danger
                @click="removeManager(record.id)"
                v-else
              >
                <i class="fa-solid fa-user-slash"></i> Hủy chức quản lý
              </a-button>
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
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useMenu } from '../../../stores/use-menu.js'
import { Modal, message } from 'ant-design-vue'
import useAxiosStore from '../../../stores/use-axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  created() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  setup() {
    const router = useRouter()
    const projectId = router.currentRoute.value.params.id // Assuming the project ID is passed as route parameter
    const addUserModalVisible = ref(false) // Trạng thái hiển thị modal
    const addUserLoading = ref(false) // Loading khi gửi request thêm nhân viên
    const loadingUsers = ref(false) // Loading khi lấy danh sách nhân viên
    const availableUsers = ref([]) // Danh sách nhân viên để thêm
    const selectedUserId = ref(null) // ID nhân viên được chọn
    const loading = ref(false) // Thêm biến loading
    const handleMenuClick = (e) => {
      console.log('click', e)
    }
    const users = ref(null) // Ban đầu là null để xử lý loading
    // Khai báo value để liên kết với input tìm kiếm
    const store = useMenu()
    const axiosStore = useAxiosStore()
    store.onSelectedKeys(['admin-projects'])

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }

    const columns = [
      { title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Vai trò', dataIndex: 'is_manager', key: 'is_manager' },
      { title: 'Công cụ', key: 'action' },
    ]
    const getuserproject = async () => {
      loading.value = true // Bắt đầu loading
      try {
        const response = await axiosStore.axiosInstance.get(
          `projects/${projectId}/users`,
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          }
        )
        users.value = response.data.users.length ? response.data.users : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng

        // Xử lý khi thành công
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu!')
      } finally {
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }

    const showAddUserModal = async () => {
      addUserModalVisible.value = true
      selectedUserId.value = [] // Reset lựa chọn thành mảng rỗng

      await fetchAvailableUsers() // Lấy danh sách nhân viên chưa thuộc dự án
    }

    const fetchAvailableUsers = async () => {
      loadingUsers.value = true
      try {
        const response = await axiosStore.axiosInstance.get(
          `projects/users/available-for-project/${projectId}`,
        )
        availableUsers.value = response.data.users.map((user) => ({
          label: user.name,
          value: user.id,
        }))
      } catch (error) {
        console.error(error)
        message.error('Lỗi khi tải danh sách nhân viên!')
      } finally {
        loadingUsers.value = false
      }
    }

    const addUserToProject = async () => {
      if (!selectedUserId.value) {
        message.warning('Vui lòng chọn nhân viên!')
        return
      }
      addUserLoading.value = true
      try {
        const response = await axiosStore.axiosInstance.post(
          `/projects/users/${projectId}/add`,
          {
            user_id: selectedUserId.value,
            is_manager: false,
          },
        )
        if (response.status === 200) {
          message.success('Thêm nhân viên vào dự án thành công!')
          addUserModalVisible.value = false // Đóng modal
          selectedUserId.value = [] // Reset lựa chọn thành mảng rỗng
          getuserproject() // Cập nhật danh sách nhân viên trong dự án
        }
      } catch (error) {
        console.error(error)
        message.error('Thêm nhân viên vào dự án thất bại!')
      } finally {
        addUserLoading.value = false
      }
    }

    const deleteuserinproject = (id) => {
      // Gửi request xóa nhân viên khỏi dự án
      axiosStore.axiosInstance
        .delete(`/projects/users/delete`, {
          params: {
            id: id,
            project_id: projectId,
          },
        })

        .then((response) => {
          if (response.status === 200) {
            message.success('Xóa nhân viên khỏi dự án thành công!')
            getuserproject() // Cập nhật lại danh sách người dùng
          }
        })
        .catch((error) => {
          console.log(error)
          message.error('Xóa nhân viên khỏi dự án thất bại')
        })
    }

    const assignManager = async (userId) => {
      try {
        const response = await axiosStore.axiosInstance.patch(
          '/projects/users/assign-manager',
          {
            projectId,
            userId,
          },
        )
        if (response.status === 200) {
          message.success('Đã chỉ định làm quản lý.')
          getuserproject() // Cập nhật danh sách nhân viên
        }
      } catch (error) {
        console.error(error)
        message.error('Không thể chỉ định làm quản lý.')
      }
    }

    const removeManager = async (userId) => {
      try {
        const response = await axiosStore.axiosInstance.patch(
          '/projects/users/revoke-manager',
          {
            projectId,
            userId,
          },
          {
            headers: {
              'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
              Accept: 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
            },
          },
        )
        if (response.status === 200) {
          message.success('Đã hủy chức vụ quản lý.')
          getuserproject() // Cập nhật danh sách nhân viên
        }
      } catch (error) {
        console.error(error)
        message.error('Không thể hủy chức vụ quản lý.')
      }
    }

    const confirmDelete = (id) => {
      Modal.confirm({
        title: 'Bạn có chắc chắn muốn xóa người này ra khỏi dự án này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          deleteuserinproject(id) // Gọi hàm xóa khi xác nhận
        },
      })
    }

    onMounted(() => {
      getuserproject()
    })
    return {
      users,
      columns,
      confirmDelete, // Xuất hàm xóa để sử dụng trong template
      loading, // Xuất biến loading để kiểm soát trạng thái loading
      handleMenuClick,
      addUserModalVisible,
      showAddUserModal,
      addUserToProject,
      fetchAvailableUsers,
      availableUsers,
      selectedUserId,
      addUserLoading,
      loadingUsers,
      removeManager,
      assignManager,
    }
  },
})
</script>
<style></style>
