<script setup lang="ts">
import { siteConfig, getPageConfig } from '../config'
import { ref, onMounted, onUnmounted } from 'vue'
import { useUmamiStats } from '../composables/useUmamiStats'

// 页面配置
const pageConfig = getPageConfig('about')

// 设置页面元数据
definePageMeta({
  title: pageConfig.title
})

// 获取Umami统计数据
const { data: stats } = await useAsyncData('umami-stats', () => useUmamiStats())

// 分散动画相关
const personalInfoRef = ref(null)
const myjourneyRef = ref(null)
const qualificationRef = ref(null)
const showDisperse = ref(false)
const scrollProgress = ref(0)
const atBottom = ref(false)

// 检测是否为移动设备
const isMobile = ref(false)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  
  // 计算滚动进度
  const maxScroll = docHeight - windowHeight
  scrollProgress.value = Math.min((scrollTop / maxScroll) * 100, 100)
  
  // 检查是否滚动到底部
  const isAtBottom = scrollTop + windowHeight >= docHeight - 10
  atBottom.value = isAtBottom
}

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
  // 只有当已经到达底部并且再次向下滚动时才触发分散动画
  if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
    event.preventDefault()
    showDisperse.value = true
    
    // 延迟导航到友链页
    setTimeout(() => {
      navigateTo('/friends')
    }, 1000)
  }
}

onMounted(() => {
  // 检测移动设备
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
})

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// 添加事件监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll)
  }
  if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
    window.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// 清理事件监听器
onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  }
  if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
    window.removeEventListener('wheel', handleWheel)
  }
})
</script>

<template>
  <div>
    <main class="flex flex-col items-center min-h-screen about-page pt-24" :class="{ 'dispersed': showDisperse }">
      <div class="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-stretch">
        <!-- 左侧：个人信息 -->
        <section ref="personalInfoRef" class="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 px-8 w-full md:w-1/2 flex flex-col items-center mb-12 component-card"
                 style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);">
          <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 text-primary text-5xl flex items-center justify-center mb-6 font-bold select-none">
            <img 
              :src="siteConfig.personal.avatar" 
              :alt="siteConfig.personal.name" 
              class="w-full h-full rounded-full object-cover" 
            />
          </div>
          <div class="text-center flex-1 flex flex-col justify-center">
            <h1 class="m-0 mb-2 text-3xl text-primary font-fumofumo">{{ siteConfig.personal.name }}</h1>
            <p class="text-muted dark:text-gray-300 text-lg mb-5 text-center">{{ siteConfig.personal.bio }}</p>
            <ul class="list-none p-0 m-0 text-base text-gray-700 dark:text-gray-300 space-y-3">
              <li>
                <strong>社交链接：</strong>
                <a 
                  :href="siteConfig.personal.social.github" 
                  target="_blank" 
                  rel="noopener" 
                  class="text-primary no-underline transition-colors duration-200 hover:underline hover:text-purple-600"
                >GitHub</a>
                <span class="mx-2 text-gray-400 dark:text-gray-500">|</span>
                <a 
                  :href="`mailto:${siteConfig.personal.social.email}`" 
                  class="text-primary no-underline transition-colors duration-200 hover:underline hover:text-purple-600"
                >邮箱</a>
              </li>
              <li><strong>地理位置：</strong>{{ siteConfig.personal.location }}</li>
              <li><strong>兴趣爱好：</strong>{{ siteConfig.personal.hobby }}</li>
              <li><strong>学习中：</strong>{{ siteConfig.personal.learning }}</li>
              <li>{{ stats?.visitors ? "已有" + stats.visitors + "人发现了我" : "统计未启用" }}</li>
            </ul>
          </div>
        </section>

        <!-- <div ref="myjourneyRef" class="component-card"> -->
          <Myjourney />
      </div>
      
      <!-- 个人履历区域 - 占据全宽 -->
      <div ref="qualificationRef" class="w-full max-w-5xl mt-8 flex justify-center component-card">
        <Qualification />
      </div>

      <!-- 滚动提示和进度指示器 -->
      <div 
        v-if="!showDisperse && !isMobile && siteConfig.theme.scrollNavigation"
        class="fixed bottom-8 right-8 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <div 
          class="mb-4"
          :class="atBottom ? 'animate-pulse' : 'animate-bounce'"
        >
          <i 
            class="text-2xl mb-2 block"
            :class="atBottom ? 'fas fa-arrow-down text-green-500' : 'fas fa-mouse text-primary'"
          ></i>
          <p class="text-sm text-muted dark:text-gray-300">
            {{ atBottom ? '再向下滚动进入友链页' : '滚动到底部' }}
          </p>
        </div>
        
        <!-- 滚动进度条 -->
        <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-150 ease-out rounded-full"
            :class="atBottom ? 'bg-green-500' : 'bg-primary'"
            :style="{ width: scrollProgress + '%' }"
          ></div>
        </div>
        <div class="text-xs text-muted dark:text-gray-300 mt-1">
          {{ Math.round(scrollProgress) }}% 
          <span v-if="atBottom" class="text-green-600 ml-1">✓ 已到底部</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 页面特定样式 */
.about-page {
  transition: all 1s ease-out;
}

.component-card {
  transition: all 1s ease-out;
}

/* 分散动画样式 */
.about-page.dispersed .component-card:nth-child(1) .component-card {
  animation: scatterLeft 1s ease-out forwards;
}

.about-page.dispersed .component-card:nth-child(2) {
  animation: scatterRight 1s ease-out forwards;
}

.about-page.dispersed .component-card:nth-child(3) {
  animation: scatterDown 1s ease-out forwards;
}

.about-page.dispersed > div > .component-card:first-child {
  animation: scatterLeft 1s ease-out forwards;
}

.about-page.dispersed > div > .component-card:last-child {
  animation: scatterDown 1s ease-out forwards;
}

@keyframes scatterLeft {
  0% {
    transform: translateX(0) translateY(0) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-150vw) translateY(-50vh) rotateZ(-45deg) scale(0.3);
    opacity: 0;
  }
}

@keyframes scatterRight {
  0% {
    transform: translateX(0) translateY(0) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(150vw) translateY(-30vh) rotateZ(45deg) scale(0.3);
    opacity: 0;
  }
}

@keyframes scatterDown {
  0% {
    transform: translateX(0) translateY(0) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(150vh) rotateZ(90deg) scale(0.2);
    opacity: 0;
  }
}
</style>