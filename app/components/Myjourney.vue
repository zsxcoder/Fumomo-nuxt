<script setup lang="ts">
// 我的历程组件
import { marked } from 'marked'

interface TimelineItem {
  date: string
  title: string
  description: string
}

const timelineItems: TimelineItem[] = [
  {
    date: '2025.11',
    title: '开始不断重构博客',
    description: '敲定了博客的框架，目前在重构名单里面的有[Mizuki](https://github.com/matsuzaka-yuki/Mizuki)、[Ryuchan](https://github.com/kobaridev/RyuChan)、[blog-v3(✅)](https://github.com/L33Z22L11/blog-v3)待续~'
  },
  {
    date: '2025.02~2025.11',
    title: '不断测试博客框架',
    description: '尝试过Hexo、Hugo、Jekyll、Vitepress和Vuepress等等，也试过动态的Typecho、Wordpress和Halo，目前觉得最舒服的还是Astro和Nuxt。'
  },
  {
    date: '2025.02',
    title: '初次接触blog-v3',
    description: '在浏览GitHub的时候发现了<a href="https://github.com/L33Z22L11/blog-v3" target="_blank">**纸鹿**</a>大佬的Clarity博客，当时使用了喵洛阁为名称。'
  },
  {
    date: '2024.11',
    title: '初次接触博客',
    description: '第一次接触的是<a href="https://github.com/miantiao-me/BroadcastChannel" target="_blank">**面条**</a>大佬的基于TG的微博客'
  }
]

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 启用 GitHub Flavored Markdown
})

// 渲染 Markdown 内容的函数
const renderMarkdown = (content: string) => {
  return marked(content)
}
</script>

<template>
  <aside class="w-full md:w-1/2 bg-white rounded-3xl shadow-lg p-8 mb-12 timeline-section flex flex-col min-w-[280px]"
         style="box-shadow: 0 4px 24px rgba(139,90,140,0.08);">
    <h2 class="text-2xl font-bold text-primary mb-6">我的历程</h2>
    <ul class="timeline list-none p-0 m-0 space-y-6 max-h-96 overflow-y-auto pr-2"
        style="scrollbar-width: thin;">
      <li v-for="(item, index) in timelineItems" :key="index">
        <div class="flex items-start gap-4">
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 rounded-full bg-primary mb-1"></div>
            <div v-if="index < timelineItems.length - 1" class="h-full w-0.5 bg-gray-200 flex-1"></div>
          </div>
          <div>
            <div class="text-sm text-gray-400">{{ item.date }}</div>
            <div class="font-semibold text-lg">{{ item.title }}</div>
            <div class="text-gray-600 text-base description-content" v-html="renderMarkdown(item.description)"></div>
          </div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* 自定义滚动条样式 */
.timeline::-webkit-scrollbar {
  width: 4px;
}

.timeline::-webkit-scrollbar-track {
  background: rgba(139, 90, 140, 0.05);
  border-radius: 2px;
}

.timeline::-webkit-scrollbar-thumb {
  background: rgba(139, 90, 140, 0.3);
  border-radius: 2px;
}

.timeline::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 90, 140, 0.5);
}

/* Markdown 渲染内容样式 */
:deep(.description-content) {
  line-height: 1.5;
}

:deep(.description-content p) {
  margin: 0.5em 0;
}

:deep(.description-content p:first-child) {
  margin-top: 0;
}

:deep(.description-content p:last-child) {
  margin-bottom: 0;
}

:deep(.description-content ul) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

:deep(.description-content li) {
  margin: 0.25em 0;
}

:deep(.description-content strong) {
  font-weight: 600;
  color: #8b5a8c;
}

:deep(.description-content a) {
  color: #8b5a8c;
  text-decoration: none;
  transition: color 0.2s;
}

:deep(.description-content a:hover) {
  color: #6a466b;
  text-decoration: underline;
}
</style>
