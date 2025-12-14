<script setup lang="ts">
import { siteConfig } from './config'

// 获取当前路由来确定导航栏的当前页面
const route = useRoute()
const currentPage = computed(() => {
  const path = route.path
  const navItem = siteConfig.navigation.find(item => item.href === path)
  return navItem?.key || ''
})

// 主题过渡控制
const themeTransition = ref(true)

// 页面加载时短暂禁用过渡，避免页面加载时的闪烁
onMounted(() => {
  themeTransition.value = true
  
  // 页面加载完成后启用过渡
  nextTick(() => {
    setTimeout(() => {
      themeTransition.value = true
    }, 100)
  })
})

// 监听路由变化
watch(() => route.path, () => {
  // 路由变化时短暂禁用过渡
  themeTransition.value = false
  nextTick(() => {
    setTimeout(() => {
      themeTransition.value = true
    }, 300)
  })
})
</script>

<template>
  <div :class="{ 'theme-transition': themeTransition }">
    <NuxtLayout>
      <!-- 导航栏 -->
      <Navbar :current-page="currentPage" />
      
      <!-- 页面内容 -->
      <NuxtPage :transition="{
        name: 'page',
        mode: 'out-in'
      }" />
      <!-- 页脚 -->
      <Footer />
    </NuxtLayout>
  </div>
</template>

<style>
/* 页面过渡动画 - 从下往上缓入 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
