<template>
  <div class="dashboard-container">
    <a-row gutter="24">
      <!-- Card 1 -->
      <a-col :span="8">
        <a-card :title="'Tổng Dự án'" :bordered="false">
          <p class="card-content">Tổng số dự án có trong hệ thống</p>
            <h2>{{ dashboardData.totalProjects }}</h2>
        </a-card>
      </a-col>

      <!-- Card 2 -->
      <a-col :span="8">
        <a-card :title="'Người dùng'" :bordered="false">
          <p class="card-content">Tổng số người dùng trong hệ thống</p>
            <h2>{{ dashboardData.totalUsers }}</h2>
        </a-card>
      </a-col>

      <!-- Card 3 -->
      <a-col :span="8">
        <a-card :title="'Phòng Ban'" :bordered="false">
          <p class="card-content">
            Tổng số phòng ban
          </p>
            <h2>{{ dashboardData.totalDepartments }}</h2>
        </a-card>
      </a-col>
    </a-row>

    <a-row gutter="24" style="margin-top: 24px">
      <!-- Table Example -->
      <a-col :span="24">
        <a-card :title="'Danh Sách Dự án'" :bordered="true">
          <a-table :columns="columns" :dataSource="dashboardData.projects" pagination />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { message, Card, Row, Col, Table } from "ant-design-vue";
import { useMenu } from "../../stores/use-menu";
import useAxiosStore from "../../stores/use-axios";

export default defineComponent({
    components: {
        "a-card": Card,
        "a-row": Row,
        "a-col": Col,
        "a-table": Table,
    },
    setup() {
        const store = useMenu();
        store.onSelectedKeys(["admin-dashboard"]);

        const axiosStore = useAxiosStore();
        const dashboardData = ref({
            totalProjects: 0,
            totalUsers: 0,
            totalDepartments: 0,
            projects: [],
        });
        const token = localStorage.getItem('accessToken')
        // Lấy store axios và khởi tạo axios với token nếu có
        if (token) {
            axiosStore.initializeAxios(token) // Cấu hình axios với token
        }
        const loading = ref(false);

        const columns = [
            {
                title: "ID Dự án",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "Tên Dự Án",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Ngày Bắt Đầu",
                dataIndex: "start_date",
                key: "start_date",
                customRender: ({ text }) => text ? new Date(text).toLocaleDateString("vi-VN") : "",
            },
            {
                title: "Ngày Kết Thúc",
                dataIndex: "end_date",
                key: "end_date",
                customRender: ({ text }) => text ? new Date(text).toLocaleDateString("vi-VN") : "",
            },
            {
                title: "Tiến Độ",
                dataIndex: "progress",
                key: "progress",
                customRender: ({ text }) => `${(text * 100).toFixed(0)}%`,
            },
        ];

        const fetchDashboardData = async () => {
            loading.value = true;
            try {
                const response = await axiosStore.axiosInstance.get("/dashboard");
                dashboardData.value = response.data; // Cập nhật dữ liệu thống kê
                console.log(response.data);
            } catch (error) {
                console.error(error);
                message.error("Không thể tải dữ liệu dashboard.");
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchDashboardData();
        });

        return {
            dashboardData,
            loading,
            columns,
        };
    },
});
</script>

  <style scoped>
.dashboard-container {
  padding: 24px;
}
.card-content {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
