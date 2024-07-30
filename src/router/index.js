import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Category from '../views/Category.vue';
import Tasks from '../views/Task.vue';
import NewTask from '../views/NewTask.vue';
import EditTask from '../views/EditTask.vue';

const routes = [
  { path: '/', redirect: '/categories' },
  { path: '/categories', name: 'categories', component: Category, meta: { requiresAuth: true } },
  { path: '/category/:id', name: 'Category', component: Category, meta: { requiresAuth: true } },
  { path: '/category/:id/tasks', name: 'Tasks', component: Tasks, meta: { requiresAuth: true } },
  { path: '/new-task', name: 'NewTask', component: NewTask, meta: { requiresAuth: true } },
  { path: '/task/:taskId/edit', name: 'EditTask', component: EditTask, props: true, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // Redirect to login page if trying to access a protected route without authentication
  } else {
    next(); // Allow the navigation to proceed
  }
});

export default router;
