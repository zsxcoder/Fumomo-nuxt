<template>
  <div class="giscus-container dark:bg-gray-800/50 dark:rounded-2xl">
    <div class="giscus-comment-header dark:bg-gray-700 dark:border-gray-600" @click="toggleComments">
      <div class="comment-title">
        <i class="fas fa-comments"></i>
        <span class="dark:text-gray-200">评论</span>
        <span v-if="commentCount > 0" class="comment-count dark:text-gray-400">({{ commentCount }})</span>
      </div>
      <i 
        class="fas fa-chevron-down transition-transform duration-200 dark:text-gray-300"
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
      <div v-show="showComments" class="giscus-wrapper dark:bg-gray-700/50">
        <div v-if="essayContent" class="referenced-content dark:bg-gray-600/50 dark:border-gray-500">
          <div class="reference-label dark:text-gray-300">引用内容：</div>
          <div class="reference-content dark:text-gray-200">{{ essayContent }}</div>
        </div>
        <div ref="giscusContainer" class="giscus"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'

interface Props {
  essayId: string
  essayContent?: string
  commentCount?: number
  defaultShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  essayContent: '',
  commentCount: 0,
  defaultShow: false
})

const colorMode = useColorMode()
const showComments = ref(props.defaultShow)
const giscusContainer = ref<HTMLElement>()

// 计算当前主题
const isDark = computed(() => colorMode.value === 'dark')

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
    script.setAttribute('data-repo', 'zsxcoder/Fumomo-nuxt')
    script.setAttribute('data-repo-id', 'R_kgDOQoZP0g')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDOQoZP0s4Czw_Z')
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', props.essayId)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    // 根据当前主题设置Giscus主题
    script.setAttribute('data-theme', isDark.value ? 'dark_dimmed' : 'light')
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

// 更新Giscus主题的函数
const updateGiscusTheme = () => {
  const giscusIframe = document.querySelector('.giscus-frame') as HTMLIFrameElement
  if (giscusIframe && giscusIframe.contentWindow) {
    // 发送消息更新主题
    giscusIframe.contentWindow.postMessage({
      giscus: {
        setConfig: {
          theme: isDark.value ? 'dark_dimmed' : 'light'
        }
      }
    }, 'https://giscus.app')
  }
}

// 监听主题变化
watch(isDark, () => {
  if (showComments.value && import.meta.client) {
    nextTick(() => {
      updateGiscusTheme()
    })
  }
})

// 初始化时如果评论区域是打开状态，则加载
onMounted(() => {
  // 无论默认状态如何，都需要设置主题监听器
  if (import.meta.client) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      // 这个监听器用于系统主题变化，但我们已经通过 colorMode 处理了
      // 保留作为后备方案
      if (!colorMode || colorMode.preference === 'system') {
        updateGiscusTheme()
      }
    }
    
    mediaQuery.addEventListener('change', updateTheme)
    
    // 如果默认展开，立即加载评论
    if (showComments.value) {
      nextTick(() => {
        loadGiscus()
      })
    }
  }
})
</script>

<style scoped>
.giscus-container {
  margin-top: 1rem;
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(139, 90, 140, 0.1);
  box-shadow: 0 2px 12px rgba(139, 90, 140, 0.05);
  transition: all 0.3s ease;
}

.dark .giscus-container {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(139, 90, 140, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.giscus-container:hover {
  border-color: rgba(139, 90, 140, 0.2);
  box-shadow: 0 4px 16px rgba(139, 90, 140, 0.1);
}

.giscus-comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  position: relative;
}

.giscus-comment-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1.25rem;
  right: 1.25rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 90, 140, 0.2), transparent);
}

.giscus-comment-header:hover {
  background-color: rgba(139, 90, 140, 0.03);
}

.dark .giscus-comment-header:hover {
  background-color: rgba(139, 90, 140, 0.08);
}

.comment-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #8b5a8c;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
}

.dark .comment-title {
  color: #c291cc;
}

.comment-count {
  font-size: 0.85rem;
  color: #8b5a8c;
  background: rgba(139, 90, 140, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.dark .comment-count {
  background: rgba(194, 145, 204, 0.15);
  color: #c291cc;
}

.giscus-wrapper {
  padding: 1.25rem;
}

.referenced-content {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.05), rgba(139, 90, 140, 0.02));
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  border-left: 4px solid #8b5a8c;
  position: relative;
  overflow: hidden;
}

.referenced-content::before {
  content: '"';
  position: absolute;
  top: 0.5rem;
  left: 0.75rem;
  font-size: 2rem;
  color: rgba(139, 90, 140, 0.2);
  font-family: Georgia, serif;
}

.dark .referenced-content {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.12), rgba(139, 90, 140, 0.05));
  border-left-color: #c291cc;
}

.dark .referenced-content::before {
  color: rgba(194, 145, 204, 0.3);
}

.reference-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #8b5a8c;
  margin-bottom: 0.5rem;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reference-label::before {
  content: '📝';
}

.dark .reference-label {
  color: #c291cc;
}

.reference-content {
  font-size: 0.95rem;
  color: #4b5563;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.6;
  padding-left: 0.5rem;
}

.dark .reference-content {
  color: #d1d5db;
}

.giscus {
  min-height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(139, 90, 140, 0.15);
  box-shadow: 0 2px 8px rgba(139, 90, 140, 0.05);
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
}

/* 深度选择器，用于修改Giscus内部样式 */
:deep(.giscus-frame) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(139, 90, 140, 0.1);
  border: 1px solid rgba(139, 90, 140, 0.15);
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dark :deep(.giscus-frame) {
  background: rgba(31, 41, 55, 0.95) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
}

/* 主容器样式 - 深色模式适配 */
:deep(.giscus-container) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}

.dark :deep(.giscus-container) {
  background: rgba(31, 41, 55, 0.95) !important;
}

/* 主容器样式 */
:deep(.giscus-container) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

/* 顶部样式 */
:deep(.giscus-main) {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
}

.dark :deep(.giscus-main) {
  background: rgba(31, 41, 55, 0.95) !important;
}

/* 评论框样式 */
:deep(.giscus-comment-box) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(139, 90, 140, 0.15);
  margin-bottom: 1rem;
  overflow: hidden;
}

.dark :deep(.giscus-comment-box) {
  background: rgba(31, 41, 55, 0.8) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
}

/* 评论输入框样式 */
:deep(.giscus-textarea),
:deep(.giscus-input) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(139, 90, 140, 0.2) !important;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif !important;
  transition: all 0.2s ease !important;
  padding: 0.75rem !important;
  color: #333 !important;
}

.dark :deep(.giscus-textarea),
.dark :deep(.giscus-input) {
  background-color: rgba(31, 41, 55, 0.95) !important;
  border-color: rgba(194, 145, 204, 0.4) !important;
  color: #f3f4f6 !important;
}

/* 输入框占位符颜色 */
:deep(.giscus-textarea::placeholder),
:deep(.giscus-input::placeholder) {
  color: #999 !important;
}

.dark :deep(.giscus-textarea::placeholder),
.dark :deep(.giscus-input::placeholder) {
  color: #9ca3af !important;
}

:deep(.giscus-textarea:focus),
:deep(.giscus-input:focus) {
  border-color: #8b5a8c !important;
  box-shadow: 0 0 0 3px rgba(139, 90, 140, 0.1) !important;
  outline: none !important;
}

/* 按钮样式 */
:deep(.giscus-button) {
  background: linear-gradient(135deg, #8b5a8c, #9d6d9e) !important;
  color: white !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 8px rgba(139, 90, 140, 0.2) !important;
}

:deep(.giscus-button:hover) {
  background: linear-gradient(135deg, #7a4878, #8b5a8c) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(139, 90, 140, 0.3) !important;
}

/* 链接样式 */
:deep(.giscus-link) {
  color: #8b5a8c !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

:deep(.giscus-link:hover) {
  color: #7a4878 !important;
  text-decoration: underline !important;
}

/* 评论卡片样式 */
:deep(.giscus-comment) {
  border-radius: 10px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(139, 90, 140, 0.1) !important;
  margin-bottom: 1rem !important;
  padding: 1rem !important;
  transition: all 0.2s ease !important;
}

.dark :deep(.giscus-comment) {
  background: rgba(31, 41, 55, 0.8) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
}

/* 评论内容文本颜色 */
:deep(.giscus-comment-text) {
  color: #333 !important;
}

.dark :deep(.giscus-comment-text) {
  color: #e5e7eb !important;
}

:deep(.giscus-comment:hover) {
  background-color: rgba(139, 90, 140, 0.03) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(139, 90, 140, 0.1) !important;
}

.dark :deep(.giscus-comment:hover) {
  background-color: rgba(194, 145, 204, 0.05) !important;
}

/* 用户头像样式 */
:deep(.giscus-avatar) {
  border-radius: 50% !important;
  border: 2px solid #8b5a8c !important;
  box-shadow: 0 2px 8px rgba(139, 90, 140, 0.2) !important;
}

/* 表情反应按钮样式 */
:deep(.giscus-reactions) {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 10px !important;
  border: 1px solid rgba(139, 90, 140, 0.1) !important;
}

.dark :deep(.giscus-reactions) {
  background: rgba(31, 41, 55, 0.8) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
}

:deep(.giscus-reaction-button) {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(139, 90, 140, 0.15) !important;
  color: #8b5a8c !important;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif !important;
  transition: all 0.2s ease !important;
}

.dark :deep(.giscus-reaction-button) {
  background-color: rgba(31, 41, 55, 0.8) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
  color: #c291cc !important;
}

:deep(.giscus-reaction-button:hover) {
  background-color: rgba(139, 90, 140, 0.1) !important;
  transform: scale(1.05) !important;
}

:deep(.giscus-reaction-button.selected) {
  background: linear-gradient(135deg, #8b5a8c, #9d6d9e) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(139, 90, 140, 0.3) !important;
}

/* 时间戳样式 */
:deep(.giscus-timestamp) {
  color: #8b5a8c !important;
  font-size: 0.85rem !important;
  font-family: monospace !important;
  opacity: 0.8 !important;
}

.dark :deep(.giscus-timestamp) {
  color: #c291cc !important;
}

/* 加载中样式 */
:deep(.giscus-loading) {
  border-color: #8b5a8c !important;
  border-right-color: transparent !important;
}

/* 分隔线样式 */
:deep(.giscus-divider) {
  border-color: rgba(139, 90, 140, 0.2) !important;
}

.dark :deep(.giscus-divider) {
  border-color: rgba(194, 145, 204, 0.3) !important;
}

/* 用户名样式 */
:deep(.giscus-user-name) {
  color: #8b5a8c !important;
}

.dark :deep(.giscus-user-name) {
  color: #c291cc !important;
}

/* 加载更多按钮 */
:deep(.giscus-load-more) {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(139, 90, 140, 0.2) !important;
  color: #8b5a8c !important;
}

.dark :deep(.giscus-load-more) {
  background: rgba(31, 41, 55, 0.9) !important;
  border-color: rgba(194, 145, 204, 0.3) !important;
  color: #c291cc !important;
}
</style>