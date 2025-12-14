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

// 加载Giscus脚本
const loadGiscus = () => {
  if (import.meta.client && giscusContainer.value) {
    // 清空容器
    giscusContainer.value.innerHTML = ''
    
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
    script.setAttribute('data-theme', 'preferred_color_scheme')
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
})

// 初始化时如果评论区域是打开状态，则加载
onMounted(() => {
  if (showComments.value) {
    nextTick(() => {
      loadGiscus()
    })
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
}
</style>