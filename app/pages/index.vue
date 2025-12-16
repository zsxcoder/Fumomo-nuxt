<script setup lang="ts">
import { siteConfig, getPageConfig } from '../config'

// 页面配置
const pageConfig = getPageConfig('home')

// 设置页面元数据
definePageMeta({
  title: pageConfig.title
})

// 动画状态
const logoRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const socialRef = ref<HTMLElement>()
const moreButtonRef = ref<HTMLElement>()
const mainRef = ref<HTMLElement>()

// 分散动画状态
const isScattering = ref(false)
const scatterProgress = ref(0)

// 移动端检测
const isMobile = ref(false)

// 社交媒体链接
const socialLinks = [
  {
    name: 'GitHub',
    icon: 'fab fa-github',
    url: siteConfig.personal.social.github,
    color: '#93FB0B'
  },
  {
    name: '邮箱',
    icon: 'fas fa-envelope',
    url: `mailto:${siteConfig.personal.social.email}`,
    color: '#ea4335'
  },
  {
    name: '博客',
    icon: 'fas fa-blog',
    url: siteConfig.personal.blog.url,
    color: '#ff6b35'
    },
  {
    name: 'QQ',
    icon: 'fab fa-qq',
    url: `https://qm.qq.com/q/Ha1GZQtMgE`,
    color: '#5DE2E7'
    },
  {
    name: 'Telegram',
    icon: 'fab fa-telegram',
    url: `https://t.me/Kemiaojun`,
    color: '#FE9900'
    },
    {
    name: 'Bilibili',
    icon: 'fab fa-bilibili',
    url: `https://t.me/Kemiaojun`,
    color: '#FE9900'
    },
    {
    name: 'X',
    icon: 'fab fa-twitter',
    url: `https://x.com/kemiao`,
    color: '#0324FF'
  }
]

// 路由导航
const router = useRouter()

// 检测移动设备
const checkMobile = () => {
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isMobileWidth = window.innerWidth <= 768
  isMobile.value = isMobileUA || isMobileWidth
}

// 添加滚轮事件监听（仅在非移动端）
const handleWheel = (e: WheelEvent) => {
  // 只有向下滚动且还没开始分散动画时才触发
  if (e.deltaY > 0 && !isScattering.value) {
    e.preventDefault()
    startScatterAnimation()
  }
}

// 检测移动设备和添加事件监听器
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 触发动画序列
onMounted(() => {
  // 触发动画序列
  setTimeout(() => {
    if (logoRef.value) logoRef.value.classList.add('bounce-in')
  }, 200)
  
  setTimeout(() => {
    if (subtitleRef.value) subtitleRef.value.classList.add('fade-in')
  }, 500)
  
  setTimeout(() => {
    if (contentRef.value) contentRef.value.classList.add('fade-in-delayed')
  }, 800)
  
  setTimeout(() => {
    if (socialRef.value) socialRef.value.classList.add('fade-in-delayed')
  }, 1100)
  
  setTimeout(() => {
    if (moreButtonRef.value) moreButtonRef.value.classList.add('fade-in-delayed')
  }, 1700)
})

// 绑定滚轮事件（仅在非移动端、客户端且配置启用时）
onMounted(() => {
  if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
    document.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
    document.removeEventListener('wheel', handleWheel)
  }
})

// 开始分散动画
const startScatterAnimation = () => {
  isScattering.value = true
  
  // 为每个组件添加分散动画类
  if (logoRef.value) {
    logoRef.value.classList.add('scatter-up')
  }
  
  if (subtitleRef.value) {
    subtitleRef.value.classList.add('scatter-down')
  }
  
  if (contentRef.value) {
    const cards = contentRef.value.querySelectorAll('.feature-card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add(`scatter-card-${index % 3}`)
      }, index * 100)
    })
  }
  
  if (socialRef.value) {
    const socialIcons = socialRef.value.querySelectorAll('a')
    socialIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add(`scatter-social-${index % 2}`)
      }, index * 100)
    })
  }
  
  if (moreButtonRef.value) {
    moreButtonRef.value.classList.add('scatter-center')
  }

  // 1.5秒后导航到文章页
  setTimeout(() => {
    router.push('/articles')
  }, 1500)
}
</script>

<template>
  <div>
    <!-- 加载动画组件 -->
    <!-- TODO: 需要创建Loading组件 -->
    
    <!-- 主要内容 -->
    <main class="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 relative" id="main-content">
      <div class="max-w-screen-xl mx-auto text-center pt-36">
        <h1 
          ref="logoRef"
          class="text-6xl font-bold text-primary mb-4 font-fumofumo opacity-0 logo"
          style="transform: scale(0.5) translateY(-3rem); text-shadow: 2px 2px 10px rgba(139, 90, 140, 0.3);"
        >
          Hi, I'm {{ siteConfig.personal.name }}
        </h1>
        
        <p 
          ref="subtitleRef"
          class="text-2xl text-muted dark:text-gray-300 mb-12 opacity-0 subtitle"
          style="transform: translateY(2rem);"
        >
          {{ siteConfig.site.subtitle }}
        </p>
        
        <div 
          ref="contentRef"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 opacity-0 content"
          style="transform: translateY(3rem);"
        >
          <div 
            v-for="(feature, index) in siteConfig.home.features" 
            :key="feature.title"
            :class="`feature-card backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105`"
            style="box-shadow: 0 8px 25px rgba(139, 90, 140, 0.15);"
          >
            <h2 class="text-2xl text-primary mb-4">{{ feature.title }}</h2>
            <p class="text-muted dark:text-gray-300 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>

        <!-- 社交媒体图标链接 -->
        <div 
          class="flex justify-center gap-6 mt-12 opacity-0 content"
          ref="socialRef"
          style="transform: translateY(3rem);"
        >
          <a 
            v-for="social in socialLinks" 
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative flex flex-col items-center text-decoration-none"
          >
            <div 
              class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 bg-white/70 dark:bg-gray-800/70 shadow-md hover:shadow-lg"
              :style="`box-shadow: 0 4px 15px rgba(139, 90, 140, 0.1);`"
            >
              <i 
                :class="social.icon + ' text-2xl transition-colors duration-300 group-hover:text-primary'"
                :style="`color: ${social.color};`"
              ></i>
            </div>
            <span class="text-xs mt-2 text-muted dark:text-gray-300 transition-colors duration-300 group-hover:text-primary">
              {{ social.name }}
            </span>
          </a>
        </div>

        <!-- 前往更多按钮 -->
        <div class="flex justify-center mt-8 opacity-0 more-button" ref="moreButtonRef" style="transform: translateY(3rem);">
          <button 
            @click="router.push('/website')"
            class="px-6 py-3 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-primary-light rounded-full transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>前往更多</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div 
        v-if="!isScattering && !isMobile && siteConfig.theme.scrollNavigation"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <div class="animate-bounce">
          <i class="fas fa-mouse text-2xl text-primary mb-2 block"></i>
          <p class="text-sm text-muted dark:text-gray-300">向下滚动进入文章页</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 分散动画样式 */
.scatter-up {
  animation: scatterUp 1.5s ease-in-out forwards;
}

.scatter-down {
  animation: scatterDown 1.5s ease-in-out forwards;
}

.scatter-card-0 {
  animation: scatterLeft 1.5s ease-in-out forwards;
}

.scatter-card-1 {
  animation: scatterCenter 1.5s ease-in-out forwards;
}

.scatter-card-2 {
  animation: scatterRight 1.5s ease-in-out forwards;
}

.scatter-social-0 {
  animation: scatterLeft 1.5s ease-in-out forwards;
}

.scatter-social-1 {
  animation: scatterRight 1.5s ease-in-out forwards;
}

@keyframes scatterUp {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translateY(-100vh);
    opacity: 0;
  }
}

@keyframes scatterDown {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translateY(100vh);
    opacity: 0;
  }
}

@keyframes scatterLeft {
  0% {
    transform: scale(1) translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translateX(-100vw) translateY(50vh) rotate(-45deg);
    opacity: 0;
  }
}

@keyframes scatterCenter {
  0% {
    transform: scale(1) translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translateX(0) translateY(-100vh) rotate(180deg);
    opacity: 0;
  }
}

@keyframes scatterRight {
  0% {
    transform: scale(1) translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translateX(100vw) translateY(50vh) rotate(45deg);
    opacity: 0;
  }
}

/* 为组件添加过渡效果 */
.feature-card {
  transition: all 0.3s ease;
}

/* 按钮淡入动画 */
.more-button.fade-in-delayed {
  animation: fadeInUp 0.8s ease-out forwards;
}
</style>
