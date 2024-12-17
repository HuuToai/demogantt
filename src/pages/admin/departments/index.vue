<template>
  <a-card title="Phòng ban" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <a-button type="primary">
          <router-link :to="{ name: 'admin-departments-create' }">
            <i class="fa-solid fa-plus"></i>
          </router-link>
        </a-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- scroll khi màn hình bé quá 576  -->
        <a-table
          :dataSource="departments"
          :columns="columns"
          :scroll="{ x: 576 }"
          :loading="loading"
          :locale="{ emptyText: 'Chưa có bản ghi nào trong hệ thống' }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>

            <template v-if="column.key === 'action'">
              <router-link
                :to="{
                  name: 'admin-departments-edit',
                  params: { id: record.id },
                }"
              >
                <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0">
                  <i class="fa-regular fa-pen-to-square"></i>
                </a-button>
              </router-link>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
</template>
  
  <script>
import { defineComponent, ref } from 'vue'
import { useMenu } from '../../../stores/use-menu.js'
import useAxiosStore from '../../../stores/use-axios'
import { onMounted } from 'vue'
import { Modal, message } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const store = useMenu()
    store.onSelectedKeys(['admin-departments'])

    const departments = ref(null) // Ban đầu là null để xử lý loading
    const loading = ref(false) // Thêm biến loading
    const columns = [
      { title: '#', key: 'index' },
      { title: 'Mã Phòng Ban', key: 'code', dataIndex: 'code' },
      { title: 'Tên Phòng Ban', dataIndex: 'description', key: 'description' },
      { title: 'Công cụ', key: 'action', fixed: 'right' },
    ]

    const axiosStore = useAxiosStore()

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }

    const getDepartments = async () => {
      loading.value = true // Bắt đầu loading
      try {
        const response = await axiosStore.axiosInstance.get('/departments')
        departments.value = response.data.length ? response.data : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu')
      }finally {
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }

    onMounted(() => {
      getDepartments()
    })

    return {
      loading,
      departments,
      columns, // Xuất hàm xóa để sử dụng trong template
    }
  },
})
</script>