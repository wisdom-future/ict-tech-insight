<template>
  <aside class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="route in mainRoutes" :key="route.name">
          <router-link
            :to="route.path"
            class="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(route.name) ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
          >
            <span class="text-lg">{{ route.meta.icon }}</span>
            <span>{{ route.meta.title }}</span>
          </router-link>
        </li>
        
        <!-- 系统管理子菜单 -->
        <li v-if="systemRoute">
          <div class="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700">
            <span class="text-lg">{{ systemRoute.meta.icon }}</span>
            <span>{{ systemRoute.meta.title }}</span>
          </div>
          <ul class="ml-8 mt-2 space-y-1">
            <li v-for="child in systemRoute.children" :key="child.name">
              <router-link
                :to="`/system/${child.path}`"
                class="flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors"
                :class="isActive(child.name) ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'"
              >
                <span>{{ child.meta.icon }}</span>
                <span>{{ child.meta.title }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const allRoutes = computed(() => router.getRoutes())

const mainRoutes = computed(() => 
  allRoutes.value.filter(r => r.meta?.title && r.name !== 'System' && !r.path.includes('/system/'))
)

const systemRoute = computed(() => 
  allRoutes.value.find(r => r.name === 'System')
)

const isActive = (routeName) => {
  return route.name === routeName
}
</script>