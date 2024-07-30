<template>
  <div class="categories">
    <h1>Categories</h1>

    <!-- Loading spinner -->
    <div v-if="loading" class="loading-spinner">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>

    <!-- Error message -->
    <p v-if="error" class="error-message">{{ error }}</p>

    <!-- Category list -->
    <div v-if="!loading && !error" class="category-list">
      <router-link v-for="category in categories" :key="category.id" :to="'/category/' + category.id + '/tasks'" class="category-link">
        <div class="category-card">
          <div class="category-info">
            <h2>{{ category.name }}</h2>
            <p>{{ getCategoryTaskCount(category) }} Tasks</p>
          </div>
          <div class="category-actions">
            <span class="view-tasks-link">View Tasks</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      categories: [],
      loading: false,
      error: ''
    };
  },
  created() {
    this.fetchCategories();
    
    // One-time window reload logic
    if (!localStorage.getItem('windowReloaded')) {
      window.onload = () => {
        localStorage.setItem('windowReloaded', true);
        window.location.reload();
      };
    }
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data.categories && data.categories.data) {
          this.categories = data.categories.data;
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to fetch categories. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    getCategoryTaskCount(category) {
      return category.tasks.length;
    }
  },
};
</script>
<style scoped>
.categories {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.category-link {
  text-decoration: none;
}

.category-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background-color 0.3s ease;
}

.category-card:hover {
  background-color: #e0e0e0;
}

.category-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.category-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.category-actions {
  margin-top: 12px;
  text-align: right;
}

.view-tasks-link {
  color: #007bff;
  cursor: pointer;
  font-weight: bold;
}

.view-tasks-link:hover {
  text-decoration: underline;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  animation: rotate 2s linear infinite;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
}

.path {
  stroke: #007bff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.error-message {
  color: #dc3545;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
}
</style>

