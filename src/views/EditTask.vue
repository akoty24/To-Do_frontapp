<template>
    <div class="edit-task">
      <h2>Edit Task</h2>
      <form @submit.prevent="submitEdit">
        <!-- Form inputs for editing task details -->
        <input type="text" v-model="editedTask.title" placeholder="Title" required>
        <textarea v-model="editedTask.description" placeholder="Description" rows="5" required></textarea>
        <select v-model="editedTask.category_id" required>
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <select v-model="editedTask.status" required>
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="in progress">In Progress</option>
        </select>
        <button type="submit">Update Task</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Task updated successfully!</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['taskId'], // Define props to receive taskId from the route
    data() {
      return {
        editedTask: {
          title: '',
          description: '',
          category_id: '',
          status: ''
        },
        categories: [],
        error: '',
        success: false
      };
    },
    mounted() {
      // Fetch categories and task details when component mounts
      this.fetchCategories();
      this.fetchTaskDetails();
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
      async fetchTaskDetails() {
        try {
          const response = await fetch(`http://localhost/api/tasks/${this.taskId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch task details');
          }
  
          const data = await response.json();
          this.editedTask = {
            title: data.task.title,
            description: data.task.description,
            category_id: data.task.category_id,
            status: data.task.status
          };
  
          console.log('Fetched Task Details:', this.editedTask);
  
        } catch (error) {
          console.error('Error fetching task details:', error);
          this.error = 'Failed to fetch task details. Please try again.';
        }
      },
      async submitEdit() {
        const formData = {
          title: this.editedTask.title,
          description: this.editedTask.description,
          category_id: this.editedTask.category_id,
          status: this.editedTask.status,
          token: localStorage.getItem('token') // Retrieve token from localStorage
        };
  
        try {
          const response = await fetch(`http://localhost/api/tasks/${this.taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${formData.token}`
            },
            body: JSON.stringify(formData)
          });
  
          if (!response.ok) {
            throw new Error('Failed to update task');
          }
  
          const data = await response.json();
          console.log('Task updated successfully:', data.task);
  
          // Set success message
          this.success = true;
  
          // Redirect to tasks list for the specific category
          const categoryId = formData.category_id; // Use formData.category_id
          this.$router.push({ name: 'Tasks', params: { id: categoryId } });
  
        } catch (error) {
          console.error('Error updating task:', error);
          this.error = 'Failed to update task. Please try again.';
        }
      }
    }
  };
  </script>
  
  
  <style scoped>
  .edit-task {
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
  
  input, select, textarea, button {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 16px;
  }
  
  textarea {
    resize: vertical; /* Allow the textarea to be resized vertically */
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
  