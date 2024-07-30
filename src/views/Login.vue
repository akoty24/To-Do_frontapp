<template>
  <div class="login">
    <h1>Login Page</h1>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      const formData = {
        email: this.email,
        password: this.password,
      };

      try {
        const response = await fetch('http://localhost/api/login', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Logged in successfully:', data);
        // Store token in local storage or Vuex for persistent login
        localStorage.setItem('token', data.token);
        // Redirect or navigate to another route
        this.$router.push('/');
      } catch (error) {
        console.error('Login error:', error);
        this.error = 'Invalid credentials. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
.login {
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

input, button {
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
</style>
