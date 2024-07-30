<template>
  <div class="new-task">
    <h2>New Task</h2>
    <form @submit.prevent="submitTask">
      <!-- Form inputs for task details -->
      <input type="text" v-model="title" placeholder="Title" required>
      <textarea v-model="description" placeholder="Description" rows="5" required></textarea>

      <select v-model="category_id" required>
        <option value="">Select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
      <select v-model="status" required>
        <option value="">Select status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="in progress">In Progress</option>
      </select>
      <button type="submit">Submit Task</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Task added successfully!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      description: '',
      category_id: '',
      status: '',
      categories: [],
      error: '',
      success: false
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch('http://localhost/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        this.categories = data.categories.data;
        console.log('Fetched Categories:', this.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to fetch categories. Please try again.';
      }
    },
    async submitTask() {
      const formData = {
        title: this.title,
        description: this.description,
        category_id: this.category_id,
        status: this.status,
        user_id: this.userId, // Replace with actual user ID
        token: localStorage.getItem('token')
      };

      try {
        const response = await fetch('http://localhost/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${formData.token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

        const data = await response.json();
        console.log('Task created successfully:', data.task);

        // Set success message and clear form inputs
        this.success = true;
        this.title = '';
        this.description = '';
        this.category_id = '';
        this.status = '';

        // Redirect to tasks list for the specific category
        const categoryId = formData.category_id; // Use formData.category_id
        this.$router.push({ name: 'Tasks', params: { id: categoryId } });

      } catch (error) {
        console.error('Error submitting task:', error);
        this.error = 'Failed to create task. Please try again.';
      }
    }
  }
};
</script>


<style scoped>
.new-task {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
}

input, select, button {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
