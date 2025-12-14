<script setup lang="ts">
// 主题状态管理
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 切换主题
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 主题图标动画控制
const isAnimating = ref(false)

// 点击时添加动画效果
const handleToggle = () => {
  isAnimating.value = true
  toggleTheme()
  
  // 动画结束后重置状态
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

// 组件挂载时添加过渡效果
onMounted(() => {
  // 添加主题切换过渡效果
  document.documentElement.classList.add('transition-colors')
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
})
</script>

<template>
  <button
    class="theme-toggle p-2 rounded-full transition-all duration-300 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 relative overflow-hidden"
    @click="handleToggle"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    :class="{ 'animate-pulse': isAnimating }"
  >
    <div class="relative w-5 h-5">
      <!-- 太阳图标（亮色模式） -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="rotate-90 scale-0 opacity-0"
        enter-to-class="rotate-0 scale-100 opacity-100"
        leave-from-class="rotate-0 scale-100 opacity-100"
        leave-to-class="-rotate-90 scale-0 opacity-0"
      >
        <svg
          v-if="!isDark"
          class="absolute inset-0 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </Transition>
      
      <!-- 月亮图标（暗色模式） -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="rotate-90 scale-0 opacity-0"
        enter-to-class="rotate-0 scale-100 opacity-100"
        leave-from-class="rotate-0 scale-100 opacity-100"
        leave-to-class="-rotate-90 scale-0 opacity-0"
      >
        <svg
          v-if="isDark"
          class="absolute inset-0 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </Transition>
    </div>
    
    <!-- 微光效果 -->
    <div 
      v-if="isAnimating"
      class="absolute inset-0 rounded-full bg-primary/30 scale-0 animate-ping"
    ></div>
  </button>
</template>

<style scoped>
/* 主题切换按钮样式 */
.theme-toggle {
  position: relative;
  overflow: hidden;
}

/* 暗色模式下的样式调整 */
.dark .theme-toggle {
  @apply text-yellow-300 hover:bg-yellow-900/20 focus:ring-yellow-500/30;
}

/* 亮色模式下的样式调整 */
.theme-toggle {
  @apply text-primary;
}

/* 增强过渡效果 */
.theme-toggle:hover {
  transform: translateY(-2px);
}

/* 动画关键帧 */
@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(139, 90, 140, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(139, 90, 140, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(139, 90, 140, 0);
  }
}

/* 暗色模式下的脉冲效果 */
.dark .theme-toggle:hover {
  animation: pulse-glow 1.5s infinite;
}
</style>