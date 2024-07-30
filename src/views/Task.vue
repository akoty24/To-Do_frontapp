<template>
  <div class="tasks">
    <!-- Title and Add Task Button -->
    <h1>{{ category.name }} Tasks</h1>

    <!-- Filter and pagination controls in one row -->
    <div class="custom-row">
      <div class="row mb-3 align-items-center justify-content-between">
        <!-- Status filter select -->
        <div class="col-auto">
          <div class="custom-select-label">Filter by Status:</div>
          <div class="custom-select-wrapper">
            <select v-model="selectedStatus" @change="applyFilter" class="custom-select">
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>
        </div>
        <!-- Pagination size select -->
        <div class="col-auto">
          <div class="custom-select-label">Items per page:</div>
          <div class="custom-select-wrapper">
            <select v-model="perPage" @change="applyPagination" class="custom-select">
              <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Task list -->
    <ul>
      <li v-for="task in tasks.data" :key="task.id" :class="['task-item', getStatusClass(task.status)]">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p>Status: {{ task.status }}</p>
        <!-- Update task status -->
        <select v-model="task.status" @change="updateTaskStatus(task)" style="width: 20%;" class="custom-select">
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
        </select>
        <!-- Edit button -->
        <router-link :to="{ name: 'EditTask', params: { taskId: task.id } }" style="margin-right: 10px;" class="btn btn-primary btn-sm">Edit</router-link>
        <!-- Delete button -->
        <button @click="deleteTask(task.id)" class="btn btn-danger btn-sm">Delete</button>
      </li>
    </ul>

    <!-- Pagination controls -->
    <div v-if="tasks.pagination.total > 1" class="d-flex justify-content-between align-items-center mt-3">
      <button @click="previousPage" :disabled="currentPage === 1" class="btn btn-secondary btn-sm">Previous</button>
      <span class="small">Page {{ currentPage }} of {{ tasks.pagination.last_page }}</span>
      <button @click="nextPage" :disabled="currentPage === tasks.pagination.last_page" class="btn btn-secondary btn-sm">Next</button>
    </div>

    <!-- Loading spinner and empty state messages -->
    <div v-if="loading" class="loading-spinner">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
    <p v-if="!loading && tasks.data.length === 0">No tasks found.</p>
    <p v-if="error">{{ error }}</p>
    <p v-if="success" class="success">Task deleted successfully!</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Tasks',
  data() {
    return {
      category: { name: '' },
      tasks: {
        data: [],
        pagination: {
          total: 0,
          per_page: 15,
          current_page: 1,
          last_page: 1
        }
      },
      selectedStatus: 'all',
      currentPage: 1,
      perPage: 15,
      loading: false,
      error: '',
      success: false // Define success variable
    };
  },
  created() {
    this.fetchCategoryAndTasks();
  },
  computed: {
    statusOptions() {
      return [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in progress' },
        { label: 'Completed', value: 'completed' }
      ];
    },
    perPageOptions() {
      return [5, 10, 15, 20];
    }
  },
  methods: {
    async fetchCategoryAndTasks() {
      try {
        this.loading = true;
        const categoryId = this.$route.params.id;
        const response = await this.fetchTasksFromApi(categoryId);
        this.handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.error = 'Failed to fetch tasks. Please try again later.';
        this.loading = false;
      }
    },
    async fetchTasksFromApi(categoryId) {
      let statusParam = '';
      if (this.selectedStatus !== 'all') {
        statusParam = `&status=${this.selectedStatus}`;
      }
      const response = await axios.get(`http://localhost/api/get_by_Category/${categoryId}?per_page=${this.perPage}&page=${this.currentPage}${statusParam}`);
      if (!response.data.tasks) {
        throw new Error('Failed to fetch tasks');
      }
      return response.data;
    },
    handleApiResponse(data) {
      this.category.name = `Category ${this.$route.params.id}`;
      this.tasks = data.tasks;
      this.loading = false;
      if (this.tasks.data.length === 0) {
        console.log('No tasks found:', data);
      }
    },
    getStatusClass(status) {
      return {
        'task-item-pending': status === 'pending',
        'task-item-in-progress': status === 'in progress',
        'task-item-completed': status === 'completed'
      };
    },
    async updateTaskStatus(task) {
      try {
        const response = await axios.put(`http://localhost/api/update_status/${task.id}`, { status: task.status });
        if (!response.data.success) {
          throw new Error('Failed to update task status');
        }
        // Optionally update tasks array or handle response as needed
      } catch (error) {
        console.error('Error updating task status:', error);
        // Handle error, show message to user
      }
    },
    async deleteTask(taskId) {
      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }

      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.delete(`http://localhost/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200 || response.status === 204) {
          // Update tasks array to reflect the deletion
          this.tasks.data = this.tasks.data.filter(task => task.id !== taskId);
          console.log('Task deleted successfully');
          this.success = true;
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        this.error = error.response.data.error || 'Failed to delete task. Please try again.';
        // Handle error, show message to user
      }
    },
    async nextPage() {
      if (this.currentPage < this.tasks.pagination.last_page) {
        this.currentPage++;
        await this.fetchCategoryAndTasks();
      }
    },
    async previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchCategoryAndTasks();
      }
    },
    async applyFilter() {
      this.currentPage = 1; // Reset to first page when filter changes
      await this.fetchCategoryAndTasks();
    },
    async applyPagination() {
      this.currentPage = 1; // Reset to first page when pagination size changes
      await this.fetchCategoryAndTasks();
    }
  }
};
</script>

<style scoped>
.tasks {
  max-width: 800px;
  margin: 0 auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.task-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: box-shadow 0.3s ease;
}

.task-item-pending {
  background-color: #ffe0b2; /* Light red for pending tasks */
}

.task-item-in-progress {
  background-color: #fff9c4; /* Light yellow for in progress tasks */
}

.task-item-completed {
  background-color: #e8f5e9; /* Light green for completed tasks */
}

.task-item:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Shadow effect on hover */
}

h1 {
  margin-bottom: 20px;
}

.small {
  font-size: 0.8rem;
  color: #666; /* Dimmer color for smaller labels */
}

.custom-select {
  width: 10%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #c82333;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 40px;
  height: 40px;
}

.path {
  stroke: #007bff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.custom-select-label {
  margin-bottom: 0.5rem; /* Adds some space below the labels */
}

.custom-select-wrapper {
  display: flex;
  align-items: center;
}

.custom-select-wrapper select {
  width: 10%; /* Ensures the select fills its container */
  max-width: 200px; /* Limits the maximum width */
}

.custom-row {
  background-color: #f8f9fa; /* Light background color */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  padding: 12px; /* Padding inside the row */
  margin-bottom: 20px; /* Space below the row */
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
</style>
