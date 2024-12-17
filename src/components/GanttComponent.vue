<template>
  <div ref="ganttContainer"></div>
  <!-- Thẻ `div` là vùng chứa biểu đồ Gantt. 
       Tham chiếu tới `div` này được lưu bằng `ref="ganttContainer"` để dễ truy cập. -->
</template>

<script>
import { gantt } from 'dhtmlx-gantt'
// Import thư viện DHTMLX Gantt để tạo biểu đồ Gantt.
import useAxiosStore from '../stores/use-axios'
const token = localStorage.getItem('accessToken')
const axiosStore = useAxiosStore()
if (token) {
  axiosStore.initializeAxios(token)
}
export default {
  props: {
    tasks: {
      // Thuộc tính `tasks` nhận dữ liệu từ component cha.
      type: Object,
      // Kiểu dữ liệu của `tasks` phải là một đối tượng.
      default() {
        // Cung cấp giá trị mặc định khi không có dữ liệu được truyền vào.
        return { data: [], links: [], users: [], project_id: [] }
        // `data` chứa danh sách nhiệm vụ và `links` chứa liên kết giữa các nhiệm vụ.
      },
    },
  },

  mounted: function () {
    gantt.plugins({
      drag_timeline: true, // Cho phép người dùng kéo (drag) timeline trên Gantt chart để thay đổi phạm vi thời gian hiển thị.
      click_drag: true, // Kích hoạt khả năng kéo và thả các công việc (task) trong Gantt chart bằng cách click và kéo chuột.
      fullscreen: true, // Cho phép người dùng chuyển Gantt chart sang chế độ toàn màn hình.
      keyboard_navigation: true, // Kích hoạt điều hướng Gantt chart bằng bàn phím.
      multiselect: true, // Cho phép người dùng chọn nhiều công việc (tasks) cùng một lúc trong Gantt chart.
      tooltip: true, // Kích hoạt tooltip, hiển thị thông tin bổ sung khi người dùng hover chuột vào các phần tử trên Gantt chart.
      undo: true, // Kích hoạt tính năng "Undo" (hoàn tác), cho phép người dùng hoàn tác các thao tác thay đổi.
      marker: true, // Hiển thị các markers (dấu mốc) trên Gantt chart, ví dụ: dấu mốc cho ngày hiện tại hoặc ngày quan trọng.
      resource: true, // Cho phép quản lý tài nguyên trong Gantt chart (ví dụ: người dùng, phòng ban, v.v.).
      baselines: true, // Hiển thị các baseline trên Gantt chart giúp người dùng theo dõi sự so sánh giữa kế hoạch và thực tế.
      critical_path: true, // Hiển thị đường đi quan trọng (critical path), giúp xác định các nhiệm vụ quan trọng.
      zoom: true, // Cho phép người dùng phóng to và thu nhỏ Gantt chart để xem các chi tiết cụ thể hơn.
      dependencies: true, // Kích hoạt khả năng hiển thị và quản lý các mối quan hệ giữa các nhiệm vụ (dependencies) trong Gantt chart.
      // quick_info: true, // Hiển thị thông tin nhanh khi người dùng di chuột qua một task.
      date_picker: true, // Cho phép người dùng chọn ngày tháng từ một widget lịch (date picker).
      mobile: true, // Hỗ trợ Gantt chart trên các thiết bị di động.
      export_pdf: true, // Cho phép xuất Gantt chart ra định dạng PDF.
      export_png: true, // Cho phép xuất Gantt chart ra định dạng PNG.
      scroll: true, // Cho phép cuộn theo chiều ngang và dọc để xem toàn bộ dữ liệu trong Gantt chart.
      loading: true, // Hiển thị màn hình chờ khi Gantt chart đang tải hoặc đang xử lý.
      tasks_on_scroll: true, // Hiển thị hoặc ẩn các công việc khi người dùng cuộn (scroll) trên Gantt chart.
      progress_bar: true, // Hiển thị thanh tiến độ cho các task trong Gantt chart để người dùng dễ dàng theo dõi.
    })
    // Thêm phương thức updateTasks
    // this.$parent.$refs.ganttComponent.updateTasks = this.updateTasks
    // Định dạng ngày được sử dụng trong biểu đồ là `YYYY-MM-DD`.
    gantt.config.date_format = '%Y-%m-%d'
    // định dạng ngày tháng năm
    gantt.config.scale_unit = 'day'
    gantt.config.date_scale = '%d'
    gantt.config.scale_height = 50
    gantt.config.subscales = [{ unit: 'day', step: 1, date: '%d' }] // Hiển thị chỉ ngày

    // hết định dạng
    //kéo thả để thay đổi thứ tự các task
    // gantt.config.order_branch = true
    // //sự kiện này được kích hoạt sau khi di chuyển task thành công
    // gantt.attachEvent("onBeforeTaskMove", (id, parent, tindex) => {
    //   var task = gantt.getTask(id);
    //   if(task.parent != parent)
    //     return false;
    //   return true;
    // })
    // Đánh dấu ngày cuối tuần (thứ Bảy và Chủ Nhật)
    // CẤU HÌNH CÁC EDITOR
    // Định nghĩa các editor cho các cột mới
    var userEditor = {
      type: 'select',
      map_to: 'user',
      options: this.$props.tasks.users.map((user) => ({
        key: user.key,
        label: user.label,
      })),
    }

    var statusEditor = {
      type: 'select',
      map_to: 'status',
      options: [
        { key: '1', label: 'Chưa bắt đầu' },
        { key: '2', label: 'Đang thực hiện' },
        { key: '3', label: 'Hoàn thành' },
        { key: '4', label: 'Tạm dừng' },
      ],
    }

    // HẾT CẤU HÌNH EDITOR
    // CẤU HÌNH FORM NHẬP LIỆU
    gantt.locale.labels.section_time = 'Thời gian'
    gantt.locale.labels.section_text = 'Tên task'
    gantt.locale.labels.section_description = 'Mô tả'
    gantt.locale.labels.section_user = 'Người phụ trách'
    gantt.locale.labels.section_status = 'Trạng thái task'
    gantt.locale.labels.section_project_id = 'Dự án'

    gantt.config.lightbox.sections = [
      {
        name: 'text',
        height: 38,
        map_to: 'text',
        type: 'textarea', // Sửa type: 'text' thành 'textarea'
        focus: true,
      },

      {
        name: 'description',
        height: 38,
        map_to: 'description',
        type: 'textarea',
      },

      {
        name: 'user',
        height: 22,
        map_to: 'user',
        type: 'select',
        options: [
          { key: '0', label: 'Chọn người dùng' }, // Tùy chọn đầu tiên
          ...this.$props.tasks.users.map((user) => ({
            key: user.key,
            label: user.label,
          })),
        ],
      },
      {
        name: 'status',
        height: 22,
        map_to: 'status',
        type: 'select',
        options: [
          { key: '1', label: 'Chưa bắt đầu' },
          { key: '2', label: 'Đang thực hiện' },
          { key: '3', label: 'Hoàn thành' },
          { key: '4', label: 'Tạm dừng' },
        ],
      },
      {
        name: 'time',
        type: 'duration',
        map_to: 'auto',
        year_range: [2024, 2030],
      },
    ]

    // HẾT CẤU HÌNH FORM TẠO TASK
    // cấu hình edit tên task và ngày task
    //đoạn này đang cấu hình kiểu dữ liệu, cấu hình và ánh xạ cho trường nào
    var textEditor = { type: 'text', map_to: 'text' }
    var dateEditor = {
      type: 'date',
      map_to: 'start_date',
      min: new Date(2020, 0, 1),
      max: new Date(2030, 0, 1),
    }
    var durationEditor = {
      type: 'number',
      map_to: 'duration',
      min: 0,
      max: 100,
    }

    // test scroll

    var users = [
      { key: '0', label: 'Chọn người dùng' }, // Tùy chọn mặc định
      ...this.$props.tasks.users.map((user) => ({
        key: user.key,
        label: user.label,
      })),
    ]
    function userLabelById(id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].key == id) {
          return users[i].label
        }
      }
      return ''
    }

    // Định nghĩa các trạng thái và chuỗi tương ứng
    const statusMapping = {
      1: 'Chưa bắt đầu',
      2: 'Đang thực hiện',
      3: 'Hoàn thành',
      4: 'Tạm dừng',
    }
    gantt.config.columns = [
      {
        name: 'wbs',
        label: 'WBS',
        min_width: 50,
        width: 50,
        template: gantt.getWBSCode,
        resize: true,
      },
      {
        name: 'text',
        label: 'Tên Task',
        tree: true,
        min_width: 180,
        width: 200,
        editor: textEditor,
        resize: true,
      },
      {
        name: 'start_date',
        label: 'Bắt đầu',
        align: 'center',
        width: 100,
        resize: true,
        editor: dateEditor,
      },
      {
        name: 'end_date',
        label: 'Kết thúc',
        align: 'center',
        width: 100,
        editor: dateEditor,
        template: function (task) {
          return gantt.templates.date_grid(task.end_date, task)
        },
        resize: true,
      },
      {
        name: 'user',
        label: 'Phụ trách',
        align: 'center',
        template: function (task) {
          return userLabelById(task.user)
        },
        width: 100,
        resize: true,
        editor: userEditor,
      },
      {
        name: 'duration',
        label: 'Thời lượng',
        align: 'center',
        width: 80,
        resize: true,
        editor: durationEditor,
      },
      {
        name: 'status',
        label: 'Tình trạng',
        align: 'center',
        width: 100,
        resize: true,
        editor: statusEditor,
        template: function (task) {
          // Lấy chuỗi tương ứng từ statusMapping, nếu không tìm thấy thì hiển thị mặc định là 'Chưa xác định'
          return statusMapping[task.status] || 'Chưa xác định'
        },
      },
      // {
      //   name: 'type',
      //   label: 'Kiểu',
      //   align: 'center',
      //   width: 80,
      //   template: function (task) {
      //     return task.type || gantt.config.types.task
      //   },
      //   resize: true,
      // },
      { name: 'add', width: 40 },
    ]

    function userLabelById(id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].key == id) {
          return users[i].label
        }
      }
      return ''
    }

    gantt.config.scale_height = 30 * 2
    gantt.config.min_column_width = 50

    gantt.config.scale_unit = 'day'
    gantt.config.subscales = [{ unit: 'month', step: 1, date: '%M, %Y' }]

    gantt.config.layout = {
      css: 'gantt_container',
      cols: [
        {
          width: 400,
          min_width: 300,
          rows: [
            {
              view: 'grid',
              scrollX: 'gridScroll',
              scrollable: true,
              scrollY: 'scrollVer',
            },
            { view: 'scrollbar', id: 'gridScroll', group: 'horizontal' },
          ],
        },
        { resizer: true, width: 1 },
        {
          rows: [
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' },
          ],
        },
        { view: 'scrollbar', id: 'scrollVer' },
      ],
    }
    gantt.attachEvent('onParse', function () {
      gantt.eachTask(function (task) {
        // Gán người dùng thực vào task.user, ví dụ như lấy từ task.assignedUser hoặc một nguồn dữ liệu khác
        task.user = task.assignee // Gán người dùng thực, 'user123' là ví dụ người dùng
        // Kiểm tra nếu task có con thì gán loại task thành project
        if (gantt.hasChild(task.id)) task.type = gantt.config.types.project
      })
    })

    // test scroll

    gantt.init(this.$refs.ganttContainer)
    // Khởi tạo biểu đồ Gantt trong thẻ `div` được tham chiếu bởi `ref="ganttContainer"`.

    gantt.parse(this.$props.tasks)
    // Nạp dữ liệu `tasks` vào biểu đồ.

    gantt.attachEvent('onTaskClick', (id, e) => {
      // Custom logic tại đây nếu cần
      return true
    })

    gantt.attachEvent('onTaskSelected', (id) => {
      // Lắng nghe sự kiện khi một nhiệm vụ được chọn.
      let task = gantt.getTask(id)
      // Tìm kiếm đối tượng người dùng trong mảng

      task.username = users.find((user) => user.key === task.user)
      // Lấy thông tin nhiệm vụ theo `id`.
      this.$emit('task-selected', task)
      // Phát sự kiện `task-selected` và truyền thông tin nhiệm vụ cho component cha.
    })

    gantt.attachEvent('onTaskIdChange', (id, new_id) => {
      // Lắng nghe sự kiện khi ID của một nhiệm vụ thay đổi.
      if (gantt.getSelectedId() == new_id) {
        // Kiểm tra xem nhiệm vụ có ID mới có đang được chọn hay không.
        let task = gantt.getTask(new_id)
        // Lấy thông tin nhiệm vụ mới.
        this.$emit('task-selected', task)
        // Phát sự kiện `task-selected` với nhiệm vụ mới.
      }
    })

    gantt.createDataProcessor((entity, action, data, id) => {
      if (!data.project_id) {
        data.project_id = this.tasks.project_id // Lấy từ tasks.project_id
      }
      // Bộ xử lý dữ liệu để đồng bộ hóa các thay đổi giữa Gantt và hệ thống.
      this.$emit(`${entity}-updated`, id, action, data)
      // Phát sự kiện với tên thực thể (`entity`), hành động (`action`),
      // dữ liệu (`data`), và ID (`id`) tới component cha.

      if (entity === 'task' && action === 'create') {
        console.log('Task mới được gửi tới server:', data)
        // Gửi yêu cầu tới server để tạo task mới.
        axiosStore.axiosInstance
          .post('/tasks', data)
          .then((response) => {
            console.log('Task đã được tạo thành công:', response.data)
            // Xử lý thành công, có thể cần cập nhật lại UI hoặc trạng thái.
            gantt.message({ type: 'success', text: 'Thêm mới Task thành công' })

            // Xử lý thành công, load lại trang
            window.location.reload() // Tải lại trang hiện tại
          })
          .catch((error) => {
            console.error('Lỗi khi tạo task:', error)
            // Xử lý lỗi (có thể hiển thị thông báo lỗi cho người dùng).
          })
      }
      // Xử lý khi cập nhật task
      if (entity === 'task' && action === 'update') {
        console.log('Task cập nhật gửi tới server:', data)
        // Gửi yêu cầu tới server để cập nhật task.
        axiosStore.axiosInstance
          .put(`/tasks/${id}`, data) // Thường dùng PUT khi cập nhật
          .then((response) => {
            console.log('Task đã được cập nhật thành công:', response.data)
            // Xử lý thành công, có thể cần cập nhật lại UI hoặc trạng thái.
            gantt.message({
              type: 'success',
              text: 'Task đã được cập nhật thành công',
            })
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật task:', error)
            // Xử lý lỗi (có thể hiển thị thông báo lỗi cho người dùng).
          })
      }

      // Xử lý dữ liệu để đồng bộ hóa thay đổi giữa Gantt và server
      if (entity === 'task' && action === 'delete') {
        console.log('Task sẽ bị xóa:', data)

        // Gửi yêu cầu xóa task lên server
        axiosStore.axiosInstance
          .delete(`/tasks/${id}`)
          .then((response) => {
            console.log('Task đã được xóa thành công:', response.data)
            // Cập nhật lại UI hoặc trạng thái nếu cần
          })
          .catch((error) => {
            console.error('Lỗi khi xóa task:', error)
            // Hiển thị thông báo lỗi nếu cần
          })
      }

      if (entity === 'link' && action === 'create') {
        console.log('Liên kết mới được tạo:', data)

        // Gửi yêu cầu tạo liên kết lên server
        axiosStore.axiosInstance
          .post('/links', {
            source: data.source,
            target: data.target,
            type: data.type,
          })
          .then((response) => {
            console.log('Liên kết đã được tạo thành công:', response.data)
            // Cập nhật UI nếu cần
            window.location.reload() // Tải lại trang hiện tại
          })
          .catch((error) => {
            console.error('Lỗi khi tạo link:', error)
            // Xử lý lỗi
          })
      }

      if (entity === 'link' && action === 'delete') {
        console.log('Liên kết sẽ bị xóa:', data)

        // Gửi yêu cầu xóa link lên server
        axiosStore.axiosInstance
          .delete(`/links/${id}`)
          .then((response) => {
            console.log('Liên kết đã được xóa thành công:', response.data)
          })
          .catch((error) => {
            console.error('Lỗi khi xóa link:', error)
          })
      }
    })
  },
  // methods: {
  //   updateTasks(newTasks) {
  //     gantt.parse(newTasks);
  //   },
  // },
}
</script>

<style>
@import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
/* Import CSS từ thư viện DHTMLX Gantt để áp dụng giao diện mặc định. */
</style>
