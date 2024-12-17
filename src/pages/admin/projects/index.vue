<template>
  <a-card title="Danh sách các dự án" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 justify-content d-flex">
        <div class="filter-project-types">
          <div
            v-for="category in categories"
            :key="category.id"
            :class="['category', { active: isActive(category.id) }]"
            @click="toggleCategory(category.id)"
            class="project-type-items"
            :style="{ backgroundColor: category.color_code }"
          >
            <div class="title-project-type">{{ category.name }}</div>
            <div class="number-project-in-type">
              {{ category.projects_count }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <router-link :to="{ name: 'admin-projects-create' }">
          <a-button class="me-2" type="primary">
            <i class="fa-solid fa-plus"></i>
          </a-button>
        </router-link>
        <router-link :to="{ name: 'admin-projects-trashed' }">
          <a-button type="primary" class="se-2">
            <i class="fa-solid fa-trash"></i>
          </a-button>
        </router-link>
        <!--                <a-input-->
        <!--                    type="text"-->
        <!--                    v-model="searchQuery"-->
        <!--                    placeholder="Search projects..."-->
        <!--                    @input="updateSearchQuery(searchQuery)"-->
        <!--                />-->
        <a-input-search
          class="search-project"
          v-model:value="value"
          @search="onSearch"
          placeholder="Tìm kiếm dự án"
          :loading="loadingSearch"
          enter-button
        />
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
          :pagination="{ pageSize: 5 }"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>
            <router-link
              :to="{
                name: 'admin-project-tasks',
                params: { id: record.id },
              }"
            >
              <template v-if="column.key === 'name'">
                <span>{{ record.name }}</span>
              </template>
            </router-link>
            <!-- Hiển thị ngày tháng năm -->
            <template
              v-if="column.key === 'start_date' || column.key === 'end_date'"
            >
              <span>{{ formatDate(record[column.key]) }}</span>
            </template>
            <!-- Hiển thị tiến độ -->
            <template v-if="column.key === 'progress'">
              <a-progress
                :size="40"
                type="circle"
                :percent="record.progress * 100"
                :stroke-color="record.category.color_code"
              />
              <!-- <span>{{ (record.progress * 100).toFixed(0) }}%</span> -->
            </template>
            <template v-if="column.key === 'remainingDays'">
              <span>
                {{ calculateRemainingDays(record.end_date) }}
              </span>
            </template>

            <template v-if="column.key === 'is_active'">
              <span v-if="record.is_active == 1" class="text-primary">
                Kích hoạt
              </span>
              <span v-else-if="record.is_active !== 1" class="text-danger">
                Bị khóa
              </span>
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
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item key="1">
                      <router-link
                        :to="{
                          name: 'admin-projects-edit',
                          params: { id: record.id },
                        }"
                      >
                        <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0"  style="width: 100%">
                          Sửa dự án<i
                            class="fa-regular fa-pen-to-square ms-2"
                          ></i>
                        </a-button>
                      </router-link>
                    </a-menu-item>
<!--                    <a-menu-item key="2">-->
<!--                      <router-link-->
<!--                        :to="{-->
<!--                          name: 'admin-project-tasks',-->
<!--                          params: { id: record.id },-->
<!--                        }"-->
<!--                      >-->
<!--                        <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0" style="width: 100%">-->
<!--                          Quản lý Task ver 1-->
<!--                          <i class="fa-solid fa-list-check ms-2"></i>-->
<!--                        </a-button>-->
<!--                      </router-link>-->
<!--                    </a-menu-item>-->

                    <a-menu-item key="3">
                      <a-button
                          style="width: 100%"
                        type="primary"
                        danger
                        @click="confirmDelete(record.id)"
                      >
                        Xóa dự án
                        <i class="fa-solid fa-trash ms-2"></i
                      ></a-button>
                    </a-menu-item>
                    <a-menu-item key="4">
                      <router-link
                        :to="{
                          name: 'admin-project-users',
                          params: { id: record.id },
                        }"
                      >
                        <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0" style="width: 100%">
                          Quản lý nhân viên trong dự án
                            <i class="fa-solid fa-users ms-2"></i>
                        </a-button>
                      </router-link>
                    </a-menu-item>
                      <a-menu-item key="5">
                          <router-link
                              :to="{
                          name: 'task',
                          params: { id: record.id },
                        }"
                          >
                              <a-button type="primary" class="me-sm-2 mb-2 mb-sm-0" style="width: 100%">
                                  Quản lý Task
                                  <i class="fa-solid fa-list-check ms-2"></i>
                              </a-button>
                          </router-link>
                      </a-menu-item>
                  </a-menu>
                </template>
                <a-button>
                    <i class="fa-solid fa-caret-down me-2"></i>
                  Chức năng
                </a-button>
              </a-dropdown>
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
import dayjs from 'dayjs' // Sử dụng thư viện dayjs
import debounce from 'lodash/debounce'
import { useFilterStore } from '../../../stores/use-filter-project'

export default defineComponent({
  created() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  setup() {
    const handleMenuClick = (e) => {
      console.log('click', e)
    }
    const value = ref('')
    const loadingSearch = ref(false) //
    const projects = ref(null) // Ban đầu là null để xử lý loading
    const categories = ref([])
    // Khai báo value để liên kết với input tìm kiếm
    const filterStore = useFilterStore()
    const store = useMenu()
    const axiosStore = useAxiosStore()
    store.onSelectedKeys(['admin-projects'])

    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    // Lấy store axios và khởi tạo axios với token nếu có
    if (token) {
      axiosStore.initializeAxios(token) // Cấu hình axios với token
    }

    const loading = ref(false) // Thêm biến loading
    // Kiểm tra xem category có trong mảng selectedCategories không
    const isActive = (categoryId) => {
      return filterStore.selectedCategories.includes(categoryId)
    }

    const toggleCategory = (categoryId) => {
      filterStore.toggleCategory(categoryId) // Gọi store để thêm/loại bỏ category
      getProjects()
    }
    const formatDate = (dateString) => {
      return dayjs(dateString).format('DD/MM/YYYY')
    }
    const calculateRemainingDays = (endDate) => {
      const end_date = dayjs(endDate)
      const currentDate = dayjs()
      const remainingDays = end_date.diff(currentDate, 'day')

      if (remainingDays >= 0) {
        return `${remainingDays} ngày`
      } else {
        const overdueDays = currentDate.diff(end_date, 'day')
        return `Đã quá ${overdueDays} ngày`
      }
    }
    const columns = [
      { title: '#', key: 'index', width: 50 },
      { title: 'Tên dự án', key: 'name', dataIndex: 'name' },
      {
        title: 'Tiến độ (%)',
        dataIndex: 'progress',
        key: 'progress',
        customRender: ({ record }) => `${(record.progress * 100).toFixed(0)}%`,
      },
      {
        title: 'Ngày còn lại',
        dataIndex: 'end_date',
        key: 'remainingDays',
        width: 150,
        render: (text, record) => {
          return calculateRemainingDays(record.end_date)
        },
      },

      { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
      { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
      { title: 'Quản lý dự án', key: 'manager' },
      { title: 'Trạng thái dự án', key: 'is_active' },
      { title: 'Công cụ', key: 'action', fixed: 'right' },
    ]

    const getProjects = async () => {
      loading.value = true // Bắt đầu loading
      if (filterStore.searchQuery) {
        console.log(filterStore.searchQuery)
        loadingSearch.value = true
      }
      try {
        const response = await axiosStore.axiosInstance.get(`/projects`, {
          params: {
            categories: filterStore.selectedCategories,
            search: filterStore.searchQuery,
          },
          headers: {
            'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
            Accept: 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
          },
        })
        // const response = await axiosStore.axiosInstance.get('/projects')
        projects.value = response.data.data.length ? response.data.data : [] // Kiểm tra nếu không có dữ liệu thì để mảng rỗng
        categories.value = response.data.category_projects // Lưu danh mục dự án
        console.log(response)
        // Xử lý khi thành công
      } catch (error) {
        // Xử lý khi bị lỗi
        console.log(error)
        message.error('Lỗi khi tải dữ liệu!')
      } finally {
        if (filterStore.searchQuery) {
          loadingSearch.value = false // Gán loadingSearch = true nếu có tìm kiếm
        }
        loading.value = false // Dừng loading sau khi nhận kết quả
      }
    }

    const onSearch = debounce(async (value) => {
      // Cập nhật search query trong filter store
      filterStore.setSearchQuery(value)
      getProjects()
    }, 300)

    // const filteredProjects = computed(() => {
    //     if (projects.value) {
    //         return projects.value.filter((project) =>
    //             filterStore.selectedCategories.length
    //                 ? filterStore.selectedCategories.includes(project.category.id)
    //                 : true
    //         );
    //     }
    //     return [];
    // });

    // Hàm lấy manager từ danh sách users
    const getManager = (users) => {
      return users.find((user) => user.pivot.is_manager === 1) || null
    }

    // Hàm xử lý xóa user
    const deleteProject = (id) => {
      axiosStore.axiosInstance
        .delete(`/projects/${id}`)
        .then((response) => {
          if (response.status === 200) {
            message.success('Xóa dự án thành công!')
            getProjects() // Cập nhật lại danh sách người dùng
          }
        })
        .catch((error) => {
          console.log(error)
          message.error('Xóa dự án thất bại')
        })
    }

    // Xác nhận trước khi xóa
    const confirmDelete = (id) => {
      Modal.confirm({
        title: 'Bạn có chắc chắn muốn xóa dự án này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          deleteProject(id)
        },
      })
    }
    onMounted(() => {
      getProjects()
    })
    return {
      isActive,
      toggleCategory,
      categories,
      projects,
      onSearch,
      value,
      loadingSearch,
      columns,
      confirmDelete, // Xuất hàm xóa để sử dụng trong template
      loading, // Xuất biến loading để kiểm soát trạng thái loading
      getManager,
      formatDate,
      handleMenuClick,
      calculateRemainingDays,
    }
  },
})
</script>

<style scoped>
.text-primary {
  color: #007bff; /* Xanh */
}

.text-danger {
  color: #dc3545; /* Đỏ */
}
/* Đảm bảo các menu item có chiều rộng bằng nhau */
.a-menu-item {
    display: flex;
    justify-content: space-between;
}

/* Đảm bảo nút trong menu cũng ăn theo chiều dài của item */
.a-menu-item .a-button {
    width: 100%;
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
  overflow-x: auto; /* Cho phép cuộn ngang */
}

/* Các mục trong bộ lọc */
.project-type-items {
    width: 400px;

  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
  padding: 20px 10px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  /*width: 120px; Định kích thước các thẻ */
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
  position: relative; /* Để đảm bảo lớp phủ nằm trên */
}

.category {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px;
  display: inline-block;
}

.project-type-items.active::after {
  content: ''; /* Nội dung giả để tạo lớp phủ */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.4); /* Lớp phủ mờ */
  z-index: 1; /* Đảm bảo lớp phủ nằm trên */
}
</style>
