const admin = [
  {
    //layout bố cục
    path: '/',
    redirect: '/dashboard',
    component: () => import('../layouts/admin.vue'),
    // thằng này là con trong layout bố cục
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../pages/admin/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'register',
        name: 'users-register',
        component: () => import('../pages/admin/users/register.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../pages/admin/users/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },

      {
        path: 'users/edit/:id',
        name: 'admin-users-edit',
        component: () => import('../pages/admin/users/edit.vue'),
      },
      {
        path: 'departments',
        name: 'admin-departments',
        component: () => import('../pages/admin/departments/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'departments/create',
        name: 'admin-departments-create',
        component: () => import('../pages/admin/departments/create.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'departments/edit/:id',
        name: 'admin-departments-edit',
        component: () => import('../pages/admin/departments/edit.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('../pages/admin/projects/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects/create',
        name: 'admin-projects-create',
        component: () => import('../pages/admin/projects/create.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects/edit/:id',
        name: 'admin-projects-edit',
        component: () => import('../pages/admin/projects/edit.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects/trashed',
        name: 'admin-projects-trashed',
        component: () => import('../pages/admin/projects/trashed.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects/tasks/:id',
        name: 'admin-project-tasks',
        component: () => import('../pages/admin/projects/task.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      // category projects
      {
        path: 'categories/projects',
        name: 'admin-categories-projects',
        component: () => import('../pages/admin/categoryproject/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'categories/projects/create',
        name: 'admin-categories-projects-create',
        component: () => import('../pages/admin/categoryproject/create.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'categories/projects/edit/:id',
        name: 'admin-categories-projets-edit',
        component: () => import('../pages/admin/categoryproject/edit.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: 'projects/users/:id',
        name: 'admin-project-users',
        component: () => import('../pages/admin/projects/users.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
      {
        path: '/tasks/:id',
        name: 'task',
        component: () => import('../pages/admin/tasks/index.vue'),
        meta: { requiresAuth: true }, // Cần đăng nhập mới có thể vào
      },
    ],
  },
  {
    // Định nghĩa route riêng cho trang login (không dùng layout chung)
    path: '/login',
    name: 'admin-login',
    component: () => import('../pages/admin/users/login.vue'),
  },
  
  {
    // Định nghĩa route riêng cho trang login (không dùng layout chung)
    path: '/mainlayout',
    name: 'layout',
    component: () => import('../layouts/main.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/404.vue'),
  },
]

export default admin;