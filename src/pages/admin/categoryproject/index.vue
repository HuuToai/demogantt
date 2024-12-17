<template>
  <a-card title="Danh sách các dự án" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <router-link :to="{ name: 'admin-categories-projects-create' }">
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
          :dataSource="categories"
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
            <template v-if="column.key === 'status'">
              <span v-if="record.status == 1" class="text-primary">
                Kích hoạt
              </span>
              <span v-else-if="record.status !== 1" class="text-danger">
                Hủy kích hoạt
              </span>
            </template>
            <template v-if="column.key === 'color_code'">
              <div
                :style="{
                  backgroundColor: isValidColor(record.color_code)
                    ? record.color_code
                    : '#ffffff',
                  width: '50px',
                  height: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }"
                title="Mã màu: {{ record.color_code }}"
              ></div>
            </template>
            <template v-if="column.key === 'action'">
              <router-link
                :to="{
                  name: 'admin-categories-projets-edit',
                  params: { id: record.id },
                }"
              >
                <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0">
                  Sửa danh mục dự án<i
                    class="fa-regular fa-pen-to-square ms-2"
                  ></i>
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
import { defineComponent, ref, onMounted } from 'vue'
import { useMenu } from '../../../stores/use-menu.js'
import { message } from 'ant-design-vue'
import useAxiosStore from '../../../stores/use-axios'

export default defineComponent({
  created() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  setup() {
    const categories = ref(null) // Ban đầu là null để xử lý loading
    // Khai báo value để liên kết với input tìm kiếm
    const store = useMenu()
    store.onSelectedKeys(['admin-categories-projets'])

    const loading = ref(false) // Thêm biến loading

    const columns = [
      { title: '#', key: 'index', width: 50 },
      { title: 'Tên dự án', key: 'name', dataIndex: 'name' },
      { title: 'Mã Màu', key: 'color_code', dataIndex: 'color_code' },
      { title: 'Thứ tự danh mục', key: 'level', dataIndex: 'level' },
      { title: 'Trạng thái Danh mục', key: 'status' },
      { title: 'Công cụ', key: 'action', fixed: 'right' },
    ]

    const axiosStore = useAxiosStore()

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }
    const isValidColor = (color) => {
      const s = new Option().style;
      s.color = color;
      return s.color !== '';
    };

    const getCategoryProjects = async () => {
      loading.value = true // Bắt đầu loading
      try {
        const response = await axiosStore.axiosInstance.get('/category_project')
        categories.value = response.data.data.length ? response.data.data : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng
        console.log(response)
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu!')
      } finally {
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }
    onMounted(() => {
      getCategoryProjects()
    })
    return {
      categories,
      isValidColor,
      columns,
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

.search-project {
  width: 300px;
  margin-left: 10px;
}

/* Bộ lọc danh mục dự án */
.filter-project-types {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Các mục trong bộ lọc */
.project-type-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ee3c59; /* Màu chủ đạo */
  color: white;
  border-radius: 8px;
  padding: 20px 10px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  width: 120px; /* Định kích thước các thẻ */
  text-align: center;
}

/* Hiệu ứng hover cho các mục */
.project-type-items:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

/* Tiêu đề loại dự án */
.title-project-type {
  font-size: 18px;
  font-weight: bold;
  /* margin-bottom: 10px; */
  text-transform: uppercase;
}

/* Số lượng dự án trong loại */
.number-project-in-type {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700; /* Màu vàng làm nổi bật */
}

.project-type-items.active {
  background-color: #007bff;
  color: white;
  border-radius: 10px;
}
</style>
