<template>
  <TheHeader />
  <div class="container-fluid mt-3">
    <div>
      <div class="nav-bar" :class="{ collapsed: !isShowNav }">
        <a-list bordered>
          <template #header>
            <!-- Thêm icon vào đây và bấm vào để toggle nav-bar -->
            <div class="title-nav">
              <!-- Hiển thị chữ "BẢNG ĐIỀU KHIỂN" chỉ khi nav-bar chưa bị co lại -->
              <div v-if="isShowNav" class="title">BẢNG ĐIỀU KHIỂN</div>
              <!-- Icon menu bên cạnh chữ "BẢNG ĐIỀU KHIỂN" -->
              <i
                class="fa-solid fa-bars menu-icon"
                @click="toggleNavBar"
                style="cursor: pointer"
              >
              </i>
            </div>
          </template>
          <TheMenu />
        </a-list>
      </div>
      <!-- Thêm lớp dynamic để thay đổi chiều rộng của content-wrapper -->
      <div class="content-wrapper" :class="{ expanded: !isShowNav }">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import TheHeader from '../components/TheHeader.vue'
import TheMenu from '../components/TheMenu.vue'
import { useNavbarStore } from '../stores/use-navbar';
const navbarStore = useNavbarStore();

import { message } from 'ant-design-vue'


export default {

  data() {
    return {
      isShowNav: false,//false thì thu lại  
    };
  },
  created() {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      message.warning('Bạn chưa đăng nhập, vui lòng đăng nhập!')
      this.$router.push({ name: 'admin-login' }) // Điều hướng về login nếu không có token
    }
  },
  components: {
    TheHeader,
    TheMenu,
  },
  methods: {
    toggleNavBar() {
      this.isShowNav = !this.isShowNav;
      navbarStore.setNav(this.isShowNav);
    },
  },
}
</script>