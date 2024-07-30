<template>
    <div>
      <header>
        <!-- Header content -->
        <h1>Your Website Name / Logo</h1>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/contact">Contact</router-link>
        </nav>
      </header>
      
      <main>
        <!-- Main content of each page will be rendered here -->
        <router-view></router-view>
      </main>
      
      <footer>
        <!-- Footer content -->
        <p>&copy; 2024 Your Website Name. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LayoutComponent',
    // Optional: Add any necessary data, methods, or computed properties here
  }
  </script>
  
  <style scoped>
  /* Optional: Add scoped CSS for this component */
  header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
  }
  
  nav {
    margin-top: 10px;
  }
  
  nav a {
    color: #fff;
    text-decoration: none;
    margin-right: 10px;
  }
  
  main {
    padding: 1rem;
  }
  
  footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 1rem;
  }
  </style>
  