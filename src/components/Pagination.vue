<template>
  <div class="pagination">
    <button @click="changePage('prev')" :disabled="currentPage === 1">Prev</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    changePage(action) {
      if (action === 'prev' && this.currentPage > 1) {
        this.currentPage--;
      } else if (action === 'next' && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
      this.$emit('pageChange');
    }
  }
};
</script>

<style scoped>
/* Add component-specific styles here */
.pagination {
  /* Pagination styles */
  margin-top: 20px;
}
button {
  /* Button styles */
  margin: 0 5px;
}
</style>
