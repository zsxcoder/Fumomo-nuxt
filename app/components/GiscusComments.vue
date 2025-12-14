<template>
  <div class="giscus-container">
    <div class="giscus-comment-header" @click="toggleComments">
      <div class="comment-title">
        <i class="fas fa-comments"></i>
        <span>评论</span>
        <span v-if="commentCount > 0" class="comment-count">({{ commentCount }})</span>
      </div>
      <i 
        class="fas fa-chevron-down transition-transform duration-200"
        :class="{ 'rotate-180': showComments }"
      ></i>
    </div>
    
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="showComments" class="giscus-wrapper">
        <div v-if="essayContent" class="referenced-content">
          <div class="reference-label">引用内容：</div>
          <div class="reference-content">{{ essayContent }}</div>
        </div>
        <div ref="giscusContainer" class="giscus"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  essayId: string
  essayContent?: string
  commentCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  essayContent: '',
  commentCount: 0
})

const showComments = ref(false)
const giscusContainer = ref<HTMLElement>()

// 切换评论显示状态
const toggleComments = () => {
  showComments.value = !showComments.value
}

// 加载自定义Giscus样式
const loadGiscusStyles = () => {
  if (import.meta.client) {
    // 检查是否已添加样式
    if (document.getElementById('custom-giscus-styles')) return
    
    const style = document.createElement('style')
    style.id = 'custom-giscus-styles'
    style.textContent = `
      /* 自定义Giscus样式以匹配博客主题 */
      :root {
        --giscus-primary-color: #8b5a8c;
        --giscus-background-color: rgba(255, 255, 255, 0.95);
        --giscus-input-bg: rgba(255, 255, 255, 0.8);
        --giscus-border-color: rgba(139, 90, 140, 0.2);
        --giscus-text-color: #666;
        --giscus-font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
      }
      
      html.dark {
        --giscus-primary-color: #c291cc;
        --giscus-background-color: rgba(17, 24, 39, 0.95);
        --giscus-input-bg: rgba(17, 24, 39, 0.8);
        --giscus-border-color: rgba(139, 90, 140, 0.3);
        --giscus-text-color: #d1d5db;
      }
      
      /* Giscus 基础样式 */
      .giscus {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08);
        backdrop-filter: blur(10px);
        background-color: var(--giscus-background-color);
        border: 1px solid var(--giscus-border-color);
        font-family: var(--giscus-font-family);
      }
    `
    
    document.head.appendChild(style)
  }
}

// 加载Giscus脚本
const loadGiscus = () => {
  if (import.meta.client && giscusContainer.value) {
    // 清空容器
    giscusContainer.value.innerHTML = ''
    
    // 加载自定义样式
    loadGiscusStyles()
    
    // 创建Giscus脚本元素
        const script = document.createElement('script')
        script.src = 'https://giscus.app/client.js'
        script.setAttribute('data-repo', 'zsxcoder/giscus-comments')
        script.setAttribute('data-repo-id', 'R_kgDOQoZP0g')
        script.setAttribute('data-category', 'home')
        script.setAttribute('data-category-id', 'DIC_kwDOQoZP0s4Czw_Z')
        script.setAttribute('data-mapping', 'pathname')
        script.setAttribute('data-strict', '1')
        script.setAttribute('data-reactions-enabled', '1')
        script.setAttribute('data-emit-metadata', '0')
        script.setAttribute('data-input-position', 'top')
        // 根据当前主题设置Giscus主题
        const isDarkMode = document.documentElement.classList.contains('dark')
        script.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
        script.setAttribute('data-lang', 'zh-CN')
        script.setAttribute('data-loading', 'lazy')
        script.setAttribute('crossorigin', 'anonymous')
        script.async = true
    
    // 添加到容器
    giscusContainer.value.appendChild(script)
  }
}

// 监听showComments变化，加载评论
watch(showComments, (newValue) => {
  if (newValue) {
    nextTick(() => {
      loadGiscus()
    })
  }
})

// 监听essayId变化，重新加载评论
watch(() => props.essayId, () => {
  if (showComments.value) {
    nextTick(() => {
      loadGiscus()
    })
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (giscusContainer.value) {
    giscusContainer.value.innerHTML = ''
  }
  
  // 清理媒体查询监听器
  if (import.meta.client && mediaQuery && updateTheme) {
    mediaQuery.removeEventListener('change', updateTheme)
  }
})

// 监听媒体查询变化
let mediaQuery: MediaQueryList | null = null
let updateTheme: ((e: MediaQueryListEvent | MediaQueryList) => void) | null = null

// 初始化时如果评论区域是打开状态，则加载
onMounted(() => {
  if (showComments.value) {
    nextTick(() => {
      loadGiscus()
    })
  }
  
  // 监听系统主题变化，更新Giscus主题
  if (import.meta.client) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const giscusIframe = document.querySelector('.giscus-frame') as HTMLIFrameElement
      if (giscusIframe && giscusIframe.contentWindow) {
        // 发送消息更新主题
        giscusIframe.contentWindow.postMessage({
          giscus: {
            setConfig: {
              theme: e.matches ? 'dark' : 'light'
            }
          }
        }, 'https://giscus.app')
      }
    }
    
    mediaQuery.addEventListener('change', updateTheme)
  }
})
</script>

<style scoped>
.giscus-container {
  margin-top: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.dark .giscus-container {
  background: #1f2937;
  border-color: rgba(255, 255, 255, 0.1);
}

.giscus-comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.giscus-comment-header:hover {
  background-color: rgba(139, 90, 140, 0.05);
}

.dark .giscus-comment-header:hover {
  background-color: rgba(139, 90, 140, 0.1);
}

.comment-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #333;
}

.dark .comment-title {
  color: #f3f4f6;
}

.comment-count {
  font-size: 0.875rem;
  color: #666;
}

.dark .comment-count {
  color: #9ca3af;
}

.giscus-wrapper {
  padding: 0 1rem 1rem;
}

.referenced-content {
  background: rgba(139, 90, 140, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #8b5a8c;
}

.dark .referenced-content {
  background: rgba(139, 90, 140, 0.1);
}

.reference-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #8b5a8c;
  margin-bottom: 0.5rem;
}

.reference-content {
  font-size: 0.875rem;
  color: #4b5563;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.dark .reference-content {
  color: #d1d5db;
}

.giscus {
  min-height: 200px;
  --color-primary: #8b5a8c;
  --color-secondary: #f0f9ff;
  --color-accent: #ffeef8;
  --color-text: #666;
  --color-bg-main: rgba(255, 255, 255, 0.95);
  --color-bg-input: rgba(255, 255, 255, 0.8);
  --color-bg-hover: rgba(139, 90, 140, 0.05);
  --color-border: rgba(139, 90, 140, 0.2);
  --font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
  border-radius: 12px;
  overflow: hidden;
}

.dark .giscus {
  --color-primary: #c291cc;
  --color-secondary: #1e293b;
  --color-accent: #2d1b3f;
  --color-text: #d1d5db;
  --color-bg-main: rgba(17, 24, 39, 0.95);
  --color-bg-input: rgba(17, 24, 39, 0.8);
  --color-bg-hover: rgba(139, 90, 140, 0.1);
  --color-border: rgba(139, 90, 140, 0.3);
}

/* 深度选择器，用于修改Giscus内部样式 */
:deep(.giscus-frame) {
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08);
  border: 1px solid var(--color-border);
  overflow: hidden;
  background-color: var(--color-bg-main);
  backdrop-filter: blur(10px);
  font-family: var(--font-family);
}

/* 评论输入框样式 */
:deep(.giscus-frame input),
:deep(.giscus-frame textarea) {
  background-color: var(--color-bg-input);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-family: var(--font-family);
  transition: all 0.2s ease;
}

:deep(.giscus-frame input:focus),
:deep(.giscus-frame textarea:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 90, 140, 0.1);
}

/* 按钮样式 */
:deep(.giscus-frame button) {
  background-color: var(--color-primary);
  color: white;
  border-radius: 8px;
  font-weight: 500;
  font-family: var(--font-family);
  transition: all 0.2s ease;
}

:deep(.giscus-frame button:hover) {
  background-color: #7a4878;
  transform: translateY(-1px);
}

/* 链接样式 */
:deep(.giscus-frame a) {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.giscus-frame a:hover) {
  color: #7a4878;
  text-decoration: underline;
}

/* 评论卡片样式 */
:deep(.giscus-frame .comment) {
  border-radius: 8px;
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  margin-bottom: 12px;
}

:deep(.giscus-frame .comment:hover) {
  background-color: var(--color-bg-hover);
}

/* 用户头像样式 */
:deep(.giscus-frame .avatar) {
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

/* 标签样式 */
:deep(.giscus-frame .reaction-button) {
  border-radius: 20px;
  background-color: var(--color-bg-input);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-family);
}

:deep(.giscus-frame .reaction-button:hover) {
  background-color: var(--color-bg-hover);
}

:deep(.giscus-frame .reaction-button.selected) {
  background-color: var(--color-primary);
  color: white;
}

/* 时间戳样式 */
:deep(.giscus-frame .timestamp) {
  color: var(--color-text);
  font-size: 0.85rem;
  font-family: monospace;
}

/* 加载中样式 */
:deep(.giscus-frame .loading-spinner) {
  border-color: var(--color-primary);
  border-right-color: transparent;
}
</style>