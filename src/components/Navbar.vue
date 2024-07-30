<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">To-Do APP</router-link>
    </div>
    <ul class="navbar-menu">
      <li v-if="isLoggedIn"><router-link to="/categories" class="navbar-link">Categories</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/new-task" class="navbar-link">Add New Task</router-link></li>
      <li v-if="isLoggedIn"><button @click="logout" class="logout-btn">Logout</button></li>
      <li v-if="!isLoggedIn"><router-link to="/login" class="navbar-link">Login</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/register" class="navbar-link">Register</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    }
  },
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }

        localStorage.removeItem('token');
        console.log('Logged out successfully');
        
        // Reload the entire page after logout
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-logo {
  color: #fff;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar-link {
  padding: 0.5rem 1rem;
  color: #fff;
  text-decoration: none;
}

.navbar-link:hover {
  background-color: #555;
}

.logout-btn {
  background-color: #dc3545; /* Change button background color */
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.logout-btn:hover {
  background-color: #c82333; /* Darker shade on hover */
}
</style>
