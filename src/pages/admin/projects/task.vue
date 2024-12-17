<template>
  <div v-if="tasks.data.length === 0" class="add-task-null">
    <div class="row mb-3">
      <div class="col-12 justify-content-end d-flex">
        <!-- Nút mở modal -->
        <a-button class="me-2" type="primary" @click="openTaskModal">
          <i class="fa-solid fa-plus"></i>
        </a-button>
      </div>
    </div>
    <!-- Modal nhập thông tin task -->
    <a-modal
      v-model:visible="isTaskModalVisible"
      title="Thêm Task"
      @ok="handleAddTask"
      @cancel="closeTaskModal"
      ok-text="Lưu"
      cancel-text="Hủy"
    >
      <a-form layout="vertical">
        <!-- Tên task -->
        <a-form-item label="Tên Task" required>
          <a-input v-model:value="newTask.text" placeholder="Nhập tên task" />
        </a-form-item>

        <!-- Mô tả -->
        <a-form-item label="Mô tả">
          <a-textarea
            v-model:value="newTask.description"
            placeholder="Nhập mô tả"
            rows="3"
          />
        </a-form-item>

        <!-- Ngày bắt đầu -->
        <a-form-item label="Ngày bắt đầu" required>
          <a-date-picker
            v-model:value="newTask.start_date"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày bắt đầu"
            @change="handleStartDateChange"
          />
        </a-form-item>

        <!-- Ngày kết thúc -->
        <a-form-item label="Ngày kết thúc" required>
          <a-date-picker
            v-model:value="newTask.end_date"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày kết thúc"
            @change="handleEndDateChange"
          />
        </a-form-item>

        <!-- Parent -->
        <a-form-item label="Parent ID" required>
          <a-input-number
            v-model:value="newTask.parent"
            :min="0"
            placeholder="Parent ID"
          />
        </a-form-item>

        <!-- Người phụ trách -->
        <a-select
          show-search
          style="width: 100%"
          v-model:value="newTask.user_id"
          placeholder="Chọn người thực hiện"
          filter-option="true"
          :filterOption="
            (input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
          "
          :options="
            users_assignee.map((user) => ({
              value: user.key,
              label: user.label,
            }))
          "
        />
      </a-form>
    </a-modal>
  </div>

  <div class="container" id="main-gantt">
    <!-- Vùng bên phải chứa thông tin task và danh sách message -->
    <div class="right-container" :class="{ open: isOpen }">
      <div class="close-btn" @click="toggleSidebar">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <!-- Hiển thị thông tin task đã chọn -->
      <div class="gantt-selected-info">
        <div v-if="selectedTask">
          <!-- Tên của task được chọn -->
          <h2>{{ selectedTask.text }}</h2>
          <!-- ID của task -->
          <span><b>Mã dự án: </b>{{ selectedTask.id }}</span
          ><br />
          <span><b>Mô tả (ghi chú): </b>{{ selectedTask.description }}</span
          ><br />
          <!-- Tiến độ hoàn thành của task dưới dạng phần trăm -->
          <span><b>Tiến độ công việc: </b> {{ progressPercentage }}</span
          ><br />
          <!-- Ngày bắt đầu của task được định dạng -->
          <span><b>Ngày bắt đầu: </b>{{ formattedStartDate }}</span
          ><br />
          <!-- Ngày kết thúc của task được định dạng -->
          <span><b>Hạn kết thúc: </b>{{ formattedEndDate }}</span
          ><br />
          <span v-if="selectedTask.username && selectedTask.username.label">
            <b>Người phụ trách: </b>{{ selectedTask.username.label }} <br
          /></span>

          <span
            ><b>Tình trạng task: </b
            >{{ statusMapping[selectedTask.status] || 'Không xác định' }}</span
          ><br />
        </div>
        <!-- Hiển thị thông báo khi chưa chọn task nào -->
        <div v-else class="select-task-prompt">
          <h2>Chọn task bất kỳ</h2>
        </div>
      </div>
      <!-- Danh sách message hiển thị thông tin log -->
      <ul class="gantt-messages">
        <li
          class="gantt-message"
          v-for="(message, index) in messages"
          v-bind:key="index"
        >
          <!-- Nội dung của từng message -->
          {{ message }}
        </li>
      </ul>
    </div>
    <!-- Chỉ hiển thị khi có dữ liệu -->
    <!-- Component Gantt hiển thị biểu đồ -->
    <!-- Lắng nghe sự kiện cập nhật task -->
    <!-- Lắng nghe sự kiện cập nhật link -->
    <!-- Lắng nghe sự kiện chọn task -->
    <GanttComponent
      v-if="tasks.data.length > 0"
      class="left-container"
      :tasks="tasks"
      @task-updated="logTaskUpdate"
      @link-updated="logLinkUpdate"
      @task-selected="selectTask"
    ></GanttComponent>
  </div>
</template>
  
  <script>
import { message } from 'ant-design-vue'

import GanttComponent from '../../../components/GanttComponent.vue' // Import component Gantt
import { useMenu } from '../../../stores/use-menu.js' // Import store quản lý menu
import useAxiosStore from '../../../stores/use-axios'
const token = localStorage.getItem('accessToken')
const axiosStore = useAxiosStore()

if (token) {
  axiosStore.initializeAxios(token)
}
const store = useMenu() // Khởi tạo store
store.onSelectedKeys(['admin-projects']) // Đánh dấu menu 'admin-projects' là đang được chọn
// Trạng thái mở/đóng sidebar
export default {
  name: 'projects', // Tên component
  components: { GanttComponent }, // Khai báo component con

  data() {
    return {
      tasks: {
        data: [], // Thay đổi để lưu trữ dữ liệu từ API
        links: [],
        users: [],
        project_id: [],
      },

      selectedTask: null, // Task được chọn
      messages: [], // Danh sách message log
      users_assignee: [],
      isTaskModalVisible: false, // Trạng thái hiển thị modal
      newTask: {
        project_id: null,
        text: '',
        description: '',
        duration: 0,
        start_date: null,
        end_date: null,
        parent: 0,
        status: 1,
        progress: 0,
        is_confirm: true,
        user_id: null,
      },
      isOpen: false,
    }
  },
  mounted() {
    // Gọi API khi component được mount
    this.fetchTasks()
  },
  unmounted() {
    window.location.reload() // Tải lại trang hiện tại
  },
  // watch: {
  //   // Khi tasks.data thay đổi, gọi lại gantt.parse() để cập nhật dữ liệu cho GanttComponent
  //   'tasks.data': function (newTasks) {
  //     if (newTasks && newTasks.length > 0) {
  //       this.$nextTick(() => {
  //         this.$refs.ganttComponent.updateTasks(newTasks) // Cập nhật lại task cho GanttComponent
  //       })
  //     }
  //   },
  // },
  computed: {
    statusMapping() {
      return {
        1: 'Chưa bắt đầu',
        2: 'Đang thực hiện',
        3: 'Hoàn thành',
        4: 'Tạm dừng',
      }
    },
    progressPercentage() {
      // Tính phần trăm tiến độ của task
      let taskProgress = this.selectedTask.progress
      if (!taskProgress) return '0'
      return `${Math.round(+taskProgress * 100)} %`
    },
    formattedStartDate() {
      // Định dạng ngày bắt đầu của task
      let taskStart = this.selectedTask.start_date
      return `${taskStart.getFullYear()} / ${
        taskStart.getMonth() + 1
      } / ${taskStart.getDate()}`
    },
    formattedEndDate() {
      // Định dạng ngày kết thúc của task
      let taskEnd = this.selectedTask.end_date
      return `${taskEnd.getFullYear()} / ${
        taskEnd.getMonth() + 1
      } / ${taskEnd.getDate()}`
    },
  },
  methods: {
    // Hàm chuyển đổi trạng thái
    toggleSidebar() {
      this.isOpen = !this.isOpen
    },
    // Gọi API lấy dữ liệu task
    fetchTasks() {
      const taskId = this.$route.params.id // Lấy projectId từ URL
      axiosStore.axiosInstance
        .get(`/tasks/${taskId}`) // Thay đổi URL API của bạn
        .then((response) => {
          // Gán dữ liệu từ API vào tasks
          this.tasks.data = response.data.tasks.data
          this.tasks.links = response.data.tasks.links // Nếu bạn cũng cần các liên kết
          this.tasks.users = response.data.tasks.users
          this.tasks.project_id = response.data.tasks.project_id
          this.users_assignee = response.data.tasks.users
          console.log(this.tasks)
        })
        .catch((error) => {
          message.error('Lấy Data thất bại!')
          console.error('Có lỗi khi gọi API:', error)
        })
    },

    selectTask(task) {
      this.isOpen = false
      this.toggleSidebar()
      this.selectedTask = task
    },
    addMessage(message) {
      // Thêm message vào danh sách và giới hạn 40 message
      this.messages.unshift(message)
      if (this.messages.length > 40) this.messages.pop()
    },
    logTaskUpdate(id, mode, task) {
      // Log thông tin cập nhật của task
      let text = task && task.text ? ` (${task.text})` : ''
      let message = `Task ${mode}: ${id} ${text}`
      this.addMessage(message)
    },
    logLinkUpdate(id, mode, link) {
      // Log thông tin cập nhật của link
      let message = `Link ${mode}: ${id}`
      if (link) message += ` ( nguồn: ${link.source}, đích: ${link.target} )`
      this.addMessage(message)
    },

    // Hiển thị modal
    openTaskModal() {
      this.isTaskModalVisible = true
    },

    // Đóng modal
    closeTaskModal() {
      this.isTaskModalVisible = false
      this.resetNewTask()
    },

    // Reset thông tin task
    resetNewTask() {
      this.newTask = {
        project_id: null,
        text: '',
        description: '',
        duration: 0,
        start_date: null,
        end_date: null,
        parent: 0,
        status: 1,
        progress: 0,
        is_confirm: true,
        user_id: null,
      }
    },

    async handleAddTask() {
      try {
        // Đảm bảo project_id đã được lấy từ tasks
        this.newTask.project_id = this.tasks.project_id

        // Kiểm tra xem start_date và end_date có hợp lệ không
        if (!this.newTask.project_id || !this.newTask.text) {
          message.error('Vui lòng nhập đủ thông tin!')
          return
        }

        // Kiểm tra nếu start_date và end_date có giá trị, và định dạng lại chúng
        // Kiểm tra nếu start_date và end_date có giá trị
        if (this.newTask.start_date && this.newTask.end_date) {
          // Chuyển đổi start_date và end_date thành đối tượng Date
          const startDate = new Date(this.newTask.start_date) // Chuyển từ chuỗi thành Date
          const endDate = new Date(this.newTask.end_date) // Chuyển từ chuỗi thành Date
          // Kiểm tra nếu ngày kết thúc trước ngày bắt đầu
          if (endDate < startDate) {
            message.error('Ngày kết thúc không thể trước ngày bắt đầu!')
            return
          }

          // Tính toán duration bằng cách lấy chênh lệch giữa endDate và startDate
          const timeDiff = endDate - startDate // Thời gian chênh lệch tính bằng mili giây
          const duration = timeDiff / (1000 * 3600 * 24) // Chuyển mili giây thành ngày

          // Lấy phần nguyên của duration (bỏ phần thập phân)
          this.newTask.duration = Math.floor(duration) // Hoặc bạn có thể dùng Math.round(duration) nếu muốn làm tròn số

          // Định dạng lại start_date và end_date nếu cần
          this.newTask.start_date = startDate.toISOString().split('T')[0] // Định dạng 'YYYY-MM-DD'
          this.newTask.end_date = endDate.toISOString().split('T')[0] // Định dạng 'YYYY-MM-DD'
        } else {
          message.error('Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc!')
          return
        }

        // console.log(this.newTask) // Kiểm tra dữ liệu trước khi gửi
        // return
        const response = await axiosStore.axiosInstance.post(
          '/tasks',
          this.newTask
        )

        message.success('Thêm Task thành công!')
        // Sử dụng setTimeout để trì hoãn việc tải lại trang
        setTimeout(() => {
          window.location.reload() // Tải lại trang sau một khoảng thời gian nhất định
        }, 1000) // 1000ms = 1 giây (bạn có thể thay đổi giá trị này tùy theo yêu cầu)
      } catch (error) {
        message.error('Thêm Task thất bại!')
        console.error(error)
      }
    },

    // Kiểm tra ngày bắt đầu
    handleStartDateChange(value) {
      this.newTask.start_date = value

      // Kiểm tra ngày bắt đầu và kết thúc hợp lệ
      this.validateDates()
    },

    // Kiểm tra ngày kết thúc
    handleEndDateChange(value) {
      this.newTask.end_date = value

      // Kiểm tra ngày bắt đầu và kết thúc hợp lệ
      this.validateDates()
    },

    // Kiểm tra tính hợp lệ của ngày bắt đầu và ngày kết thúc
    validateDates() {
      const { start_date, end_date } = this.newTask

      // Kiểm tra nếu có đủ cả ngày bắt đầu và ngày kết thúc
      if (start_date && end_date) {
        const startDate = new Date(start_date)
        const endDate = new Date(end_date)
        // Loại bỏ phần thời gian, chỉ so sánh ngày, tháng, năm
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(0, 0, 0, 0)
        // Kiểm tra nếu ngày kết thúc trước ngày bắt đầu
        if (endDate < startDate) {
          this.$message.error('Ngày kết thúc không thể trước ngày bắt đầu!')
        }

        // Kiểm tra nếu ngày kết thúc trùng với ngày bắt đầu
        if (startDate.getTime() === endDate.getTime()) {
          this.$message.error('Ngày kết thúc không thể trùng với ngày bắt đầu!')
        }
      }
    },
  },
}
</script>
  
  <style>
html,
.content-wrapper {
  display: flex; /* Sử dụng flexbox để quản lý bố cục */
  flex-direction: row; /* Đặt các phần tử con nằm ngang */
  height: 100vh; /* Chiều cao toàn màn hình */
  overflow: hidden; /* Ẩn phần nội dung vượt quá kích thước */
}


.left-container {
  flex: 1; /* Tự động chiếm toàn bộ không gian còn lại */
  height: 100%;
  width: auto; /*o;
  background-color: #f9f9f9; /* Màu nền nhẹ */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng trong */
  overflow: hidden; /* Ẩn nội dung tràn */
}

.right-container {
  position: fixed;
  right: -300px; /* Ẩn container mặc định */
  width: 300px;
  height: 100vh;
  background-color: #ffffff;
  border-left: 1px solid #dcdcdc;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  overflow-y: auto;
  padding: 15px;
  transition: right 0.3s ease; /* Hiệu ứng trượt */
}

.right-container.open {
  right: 0; /* Hiển thị container */
}

.close-btn {
  position: absolute;
  top: 0px;
  left: 0px; /* Đặt nút bên ngoài container */
  width: 25px;
  height: 25px;
  background-color: #ff4d4f; /* Màu đỏ */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.close-btn:hover {
  background-color: #d9363e;
}
.gantt-messages {
  list-style-type: none;
  height: 50%;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 5px;
}
.gantt-messages > .gantt-message {
  background-color: #f9f9f9; /* Lighter background for a softer look */
  border-left: 5px solid #d69000; /* Solid left border for emphasis */
  font-family: 'Arial', sans-serif; /* Simplified font stack */
  font-size: 15px; /* Slightly larger font size for readability */
  margin: 8px 0;
  padding: 10px 15px; /* Increased padding for a cleaner, more spacious design */
  border-radius: 8px; /* Rounded corners for a modern feel */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  transition: box-shadow 0.3s ease-in-out; /* Smooth shadow transition on hover */
}

.gantt-messages > .gantt-message:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Hover effect for interactive feel */
}

.gantt-selected-info {
  border-bottom: 2px solid #e1e1e1; /* Thicker border for better separation */
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  height: auto; /* Adjust height to content */
  line-height: 28px;
  padding: 12px 20px;
  background-color: #f9f9f9; /* Subtle background color */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adding depth with a subtle shadow */
  transition: box-shadow 0.3s ease-in-out; /* Smooth shadow transition */
}

.gantt-selected-info h2 {
  font-size: 18px; /* Slightly larger header font */
  font-weight: bold;
  margin-bottom: 8px;
  color: #333; /* Darker text for better contrast */
  border-bottom: 2px solid #e1e1e1; /* Better border for the header */
  padding-bottom: 8px;
}

.select-task-prompt h2 {
  color: #b0b0b0; /* Softer color for a more modern, subdued appearance */
  font-size: 16px; /* Larger font for clarity */
  font-weight: 500;
  letter-spacing: 0.5px; /* Added spacing for a more refined look */
  margin-bottom: 10px; /* More breathing space */
}


.container#main-gantt {
  margin: 0; /* Loại bỏ khoảng cách bên ngoài */
  padding: 0; /* Loại bỏ khoảng cách bên trong */
  max-width: 100%;
}
</style>
  