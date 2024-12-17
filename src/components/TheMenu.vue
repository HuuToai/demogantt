<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <a-menu-item key="admin-dashboard">
      <router-link
        class="text-decoration-none"
        :to="{ name: 'admin-dashboard' }"
        title="Trang chủ"
      >
        <span>
          <HomeOutlined class="me-1" />
          Trang chủ
        </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-users">
      <router-link
        title="Tài khoản"
        class="text-decoration-none"
        :to="{ name: 'admin-users' }"
      >
        <span>
          <UserOutlined class="me-1" />
          Tài Khoản
        </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-departments">
      <router-link
        title="Quản lý phòng ban"
        class="text-decoration-none"
        :to="{ name: 'admin-departments' }"
      >
        <span>
          <ApartmentOutlined class="me-1" />
          Quản lý phòng ban
        </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-categories-projects">
      <router-link
          title="Quản lý danh mục dự án"
          class="text-decoration-none"
          :to="{ name: 'admin-categories-projects' }"
      >
        <span>
          <i class="fa-solid fa-layer-group"></i>
          Quản lý danh mục dự án
        </span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-projects">
      <router-link
        title="Quản lý dự án"
        class="text-decoration-none"
        :to="{ name: 'admin-projects' }"
      >
        <span>
          <i class="fa-solid fa-list-check"></i>
          Quản lý Dự án
        </span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>


<script>
import { defineComponent } from 'vue'
import {
  HomeOutlined,
  UserOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useMenu } from '../stores/use-menu.js'
export default defineComponent({
  setup() {
    const store = useMenu()

    return {
      ...storeToRefs(store),
    }
  },
  components: {
    HomeOutlined,
    UserOutlined,
    ApartmentOutlined,
  },
})
</script>


