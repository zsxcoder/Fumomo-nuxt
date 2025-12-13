<script setup lang="ts">
import { siteConfig } from '../config'

interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: siteConfig.site.title,
  description: siteConfig.site.description
})

// 构建完整的页面标题
const fullTitle = computed(() => 
  props.title === siteConfig.site.title 
    ? props.title 
    : `${siteConfig.site.title}-${props.title}`
)

// 设置页面元数据
useHead({
  title: fullTitle,
  meta: [
    { name: 'description', content: props.description },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteConfig.site.url },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: props.description },
    // Twitter
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:url', content: siteConfig.site.url },
    { property: 'twitter:title', content: fullTitle },
    { property: 'twitter:description', content: props.description }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
  ],
  // Analytics - Umami
  script: [
    {
      defer: true,
      src: 'https://cloud.umami.is/script.js',
      'data-website-id': 'ac5e0626-4863-41ec-8a66-98ba076846a0'
    }
  ]
})

// 自定义光标逻辑
const customCursor = ref<HTMLElement>()
const customCursorFollower = ref<HTMLElement>()
let mouseX = 0
let mouseY = 0
let followerX = 0
let followerY = 0
let scrollOffset = 0 // 滚轮偏移量
let isScrolling = false // 是否在滚动中

// 检查配置中是否启用自定义鼠标样式
const customCursorEnabled = siteConfig.theme.customCursor

// 检测是否是桌面端（支持悬停的设备）
const isDesktop = typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false

// 鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  if (customCursor.value) {
    customCursor.value.style.left = mouseX + 'px'
    customCursor.value.style.top = mouseY + 'px'
  }
}

// 跟随光标动画
const animateFollower = () => {
  const dx = mouseX - followerX
  const dy = mouseY - followerY
  
  // 添加滚轮偏移效果
  const scrollEffect = isScrolling ? scrollOffset : 0
  
  followerX += dx * 0.1
  followerY += (dy + scrollEffect) * 0.1
  
  if (customCursorFollower.value) {
    customCursorFollower.value.style.left = followerX + 'px'
    customCursorFollower.value.style.top = followerY + 'px'
  }
  
  // 逐渐减少滚轮偏移
  if (isScrolling) {
    scrollOffset *= 0.95
    if (Math.abs(scrollOffset) < 0.1) {
      scrollOffset = 0
      isScrolling = false
    }
  }
  
  requestAnimationFrame(animateFollower)
}

// 滚轮事件处理
const handleWheel = (e: WheelEvent) => {
  // 调试信息（生产环境中可以移除）
  console.log('Wheel event detected:', e.deltaY, 'Direction:', e.deltaY > 0 ? 'down' : 'up')
  
  const scrollDirection = e.deltaY > 0 ? 1 : -1
  const scrollIntensity = Math.min(Math.abs(e.deltaY) * 0.5, 80) // 增加强度
  
  // 反向设置滚轮偏移，向下滚动时跟随光标向上"逃跑"
  scrollOffset = -scrollDirection * scrollIntensity
  isScrolling = true
  
  console.log('Scroll offset set to:', scrollOffset)
  
  // 立即应用更明显的视觉效果
  if (customCursorFollower.value) {
    // 直接设置样式，确保立即生效
    customCursorFollower.value.style.setProperty('transition', 'opacity 0.1s ease, transform 0.15s ease', 'important')
    customCursorFollower.value.style.setProperty('opacity', '0.1', 'important')
    customCursorFollower.value.style.setProperty('transform', `translate(-50%, -50%) scale(1.5)`, 'important')
    
    setTimeout(() => {
      if (customCursorFollower.value) {
        customCursorFollower.value.style.setProperty('opacity', '0.5', 'important')
        customCursorFollower.value.style.setProperty('transform', `translate(-50%, -50%) scale(1)`, 'important')
        customCursorFollower.value.style.setProperty('transition', 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'important')
      }
    }, 200)
  }
}

// 鼠标悬停在可点击元素上
const handleMouseEnter = () => {
  if (customCursor.value) {
    customCursor.value.classList.add('hover')
  }
  if (customCursorFollower.value) {
    customCursorFollower.value.classList.add('hover')
  }
}

const handleMouseLeave = () => {
  if (customCursor.value) {
    customCursor.value.classList.remove('hover')
  }
  if (customCursorFollower.value) {
    customCursorFollower.value.classList.remove('hover')
  }
}

// 存储可点击元素引用
let clickableElements: NodeListOf<Element> | null = null

// 初始化自定义光标
onMounted(() => {
  // 只有在配置启用且是桌面端时才启用自定义光标
  if (customCursorEnabled && isDesktop) {
    // 添加自定义光标控制类到body
    document.body.classList.add('custom-cursor-active')
    
    // 绑定事件
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    // 绑定多种滚轮事件以确保兼容性
    document.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('wheel', handleWheel, { passive: false })
    animateFollower()
    
    // 为所有可点击元素添加悬停效果
    clickableElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])')
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })
  }
})

// 清理事件监听器
onUnmounted(() => {
  if (customCursorEnabled && isDesktop) {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('wheel', handleWheel)
    window.removeEventListener('wheel', handleWheel)
    document.body.classList.remove('custom-cursor-active')
    
    if (clickableElements) {
      clickableElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }
})
</script>

<template>
  <div>
    <!-- 自定义光标 - 只在配置启用时渲染 -->
    <ClientOnly>
      <template v-if="siteConfig.theme.customCursor">
        <div 
          ref="customCursor" 
          class="custom-cursor"
        ></div>
        <div 
          ref="customCursorFollower" 
          class="custom-cursor-follower"
        ></div>
      </template>
    </ClientOnly>
    
    <!-- 页面内容 -->
    <div class="min-h-screen bg-gray-50 font-fumofumo overflow-x-hidden">
      <slot />
    </div>
  </div>
</template>

<style>
/* 自定义光标样式已在global.css中定义 */
</style>
