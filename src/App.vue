<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<style>
#app {
  font-family: 'Inter', sans-serif;
}
</style>