<template>
  <div class="header container-fluid">
    <div class="row header-row">
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer()">
          <i class="fa-solid fa-align-justify"></i>
        </span>
      </div>
      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <router-link title="Trang chủ" :to="{ name: 'admin-dashboard' }">
          <img
            :src="logo"
            alt="logo"
            height="32"
            width="34"
            class="ms-3 me-3 logo-header"
          />
        </router-link>
<!--        <span class="d-none d-sm-flex">QUẢN TRỊ</span>-->
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-end"
      >
        <LogoutOutlined
          style="font-size: 24px; cursor: pointer"
          @click="confirmLogout()"
        />
      </div>
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawerIUser()">
          <DoubleRightOutlined />
        </span>
      </div>
    </div>
  </div>

  <a-drawer v-model:open="visible" title="Danh Mục" placement="left">
    <TheMenu />
  </a-drawer>
  <a-drawer v-model:open="visible_user" title="ADMIN" placement="right">
    <p>
      <span
        style="font-size: 16px; cursor: pointer; color: #007bff"
        @click="confirmLogout()"
      >
        Đăng xuất
        <LogoutOutlined />
      </span>
    </p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import TheMenu from '../components/TheMenu.vue'
import logo from '../assets/3hine-01.svg'
import { LogoutOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'

import { useRouter } from 'vue-router'
const visible = ref(false)
const visible_user = ref(false)
const router = useRouter()
const showDrawer = () => {
  visible.value = true
}
const showDrawerIUser = () => {
  visible_user.value = true
}

const confirmLogout = () => {
  Modal.confirm({
    title: 'Bạn có chắc chắn muốn xóa đăng xuất?',
    okText: 'Đăng xuất',
    okType: 'danger',
    cancelText: 'Hủy',
    onOk: () => {
      handleLogout()
    },
  })
}

const handleLogout = () => {
  // Xóa token trong localStorage
  localStorage.removeItem('accessToken')

  // Hiển thị thông báo
  message.success('Đăng xuất thành công')

  // Điều hướng người dùng đến trang login
  router.push({ name: 'admin-login' })
}
</script>

<style scoped>
.header-row {
  /*padding: 1rem;*/
  color: white;
}

.header {
  /*height: 60px;*/
  background-color: #EE3C59;
}
.logo-header{
    width: 80px;
    height: 60px;
}
</style>
