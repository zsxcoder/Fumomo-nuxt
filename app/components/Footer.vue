<script setup lang="ts">
// Footer组件 - 统一的页脚
const currentYear = new Date().getFullYear()

// 快速导航链接
const quickLinks = [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  { name: '文章', href: '/articles' },
  { name: '项目', href: '/projects' },
  { name: '网站', href: '/website' },
    { name: '朋友们', href: '/friends' },
    { name: '朋友圈', href: '/fcircle' },
    { name: '留言板', href: '/guestbook' },
    { name: '随笔', href: '/essays' },
  
]

// 社交媒体链接
const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/zsxcoder', icon: 'fab fa-github' },
  { name: '邮件', href: 'mailto:me@mcyzsx.top', icon: 'fas fa-envelope' },
    { name: 'Telegram', href: 'https://t.me/KemiaoJun', icon: 'fab fa-telegram' },
    { name: 'Twitter', href: 'https://x.com/kemiaojun', icon: 'fab fa-twitter' },
    { name: 'QQ', href: 'https://qm.qq.com/q/Ha1GZQtMgE', icon: 'fab fa-qq' },
  { name: 'Bilibili', href: 'https://space.bilibili.com/3546643173477234', icon: 'fab fa-bilibili' },
]
</script>

<template>
  <footer class="relative mt-auto bg-gradient-to-b from-primary/5 to-primary/10 dark:from-gray-800/80 dark:to-gray-900/90 border-t border-primary/10 dark:border-gray-700 transition-all duration-300">
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
    </div>
    
    <div class="max-w-screen-xl mx-auto px-4 py-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 网站信息 -->
        <div class="flex flex-col items-center md:items-start">
          <h3 class="text-xl font-bold font-fumofumo mb-4 text-primary dark:text-primary-light">ZSXのHomePage</h3>
          <p class="text-sm mb-4 text-muted dark:text-gray-300 text-center md:text-left">
            基于fumomo的主页自用。
          </p>
          <div class="flex space-x-3 mt-2">
            <a 
              v-for="link in socialLinks" 
              :key="link.name"
              :href="link.href" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 dark:hover:bg-primary/30 hover:-translate-y-1"
              :aria-label="link.name"
            >
              <i :class="link.icon" class="text-primary dark:text-primary-light"></i>
            </a>
          </div>
        </div>
        
        <!-- 快速导航 -->
        <div class="flex flex-col items-center">
          <h3 class="text-lg font-semibold mb-4 text-primary dark:text-primary-light">快速导航</h3>
          <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-center">
            <li v-for="link in quickLinks" :key="link.name">
              <NuxtLink 
                :to="link.href" 
                class="text-sm text-muted dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 hover:-translate-y-0.5 inline-block"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <!-- 技术栈信息 -->
        <div class="flex flex-col items-center md:items-end">
          <h3 class="text-lg font-semibold mb-4 text-primary dark:text-primary-light">技术栈</h3>
          <p class="text-sm mb-2 text-muted dark:text-gray-300 text-center md:text-right">
            使用 Vue 3 + TypeScript 构建
          </p>
          <div class="flex items-center space-x-2 text-sm text-muted dark:text-gray-300">
            <span>Powered by</span>
            <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="hover:underline transition-all duration-300 text-primary dark:text-primary-light">Nuxt</a>
            <span>&</span>
            <a href="https://github.com/zsxcoder/Fumomo-nuxt" target="_blank" rel="noopener noreferrer" class="hover:underline transition-all duration-300 text-primary dark:text-primary-light">Fumomo</a>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="mt-8 pt-6 border-t border-primary/10 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-muted dark:text-gray-300">
          © {{ currentYear }} 钟神秀. 保留所有权利。
        </p>
        <p class="text-sm text-muted dark:text-gray-300 mt-2 md:mt-0">
          开源于 <a href="https://github.com/Hakutyan-bai/fumomo-nuxt" target="_blank" rel="noopener noreferrer" class="hover:underline transition-all duration-300 text-primary dark:text-primary-light">GitHub</a>
        </p>
      </div>
    </div>
  </footer>
</template>
