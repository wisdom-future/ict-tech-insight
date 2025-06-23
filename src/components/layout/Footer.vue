<template>
  <footer class="bg-white border-t border-gray-200 py-4 px-6">
    <div class="flex items-center justify-between text-sm text-gray-500">
      <div>
        © 2025 ICT Tech Insight. All rights reserved.
      </div>
      <div class="flex items-center space-x-4">
        <span>Powered by Vue.js & GitHub Pages</span>
        <span>•</span>
        <span>Version {{ version }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const version = ref('1.0.0')
</script>