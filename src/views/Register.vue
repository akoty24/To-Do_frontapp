<template>
  <div class="register">
    <h1>Register Page</h1>
    <form @submit.prevent="register">
      <input type="text" v-model="name" placeholder="Name" required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required>
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword
      };

      try {
        const response = await fetch('http://localhost/api/register', { // Adjust URL as per your Laravel backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log('Registered successfully:', data.user);
              this.$router.push('/');
      } catch (error) {
        console.error('Registration error:', error);
        this.error = 'Registration failed. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
.register {
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
  background-color: #28a745;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
