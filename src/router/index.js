import { createRouter, createWebHistory } from "vue-router";

import admin from "./admin.js";

const routes = [...admin];

const router = createRouter (
    {
        history: createWebHistory(),
        routes
    }
);

// Global Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("accessToken");
  
    // Kiểm tra nếu route yêu cầu xác thực mà không có token
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
      // Nếu không có token, điều hướng về trang login
      next({ name: "admin-login" });
    } else {
      // Nếu có token hoặc không yêu cầu xác thực, tiếp tục truy cập
      next();
    }
  });
  
export default router;