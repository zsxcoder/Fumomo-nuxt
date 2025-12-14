<template>
  <button
    class="copy-button"
    @click="copyToClipboard"
    :title="`复制${prompt}`"
  >
    <i class="fas fa-copy mr-1"></i>
    {{ prompt }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  code: string
  prompt: string
}

const props = defineProps<Props>()

// 使用全局Toast函数
const { $toast } = useNuxtApp()

// 复制到剪贴板功能
async function copyToClipboard() {
  let success = false;
  
  try {
    // 优先尝试使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.code)
      success = true;
    } else {
      // 备用方案：使用旧方法
      success = fallbackCopyTextToClipboard(props.code);
    }
    
    if (success) {
      // 尝试使用全局Toast
      if ($toast) {
        $toast(`已复制${props.prompt}`)
      } else {
        // 备用方案：使用内置实现
        showInternalToast(`已复制${props.prompt}`)
      }
    }
  } catch (err) {
    console.error('复制失败:', err)
    
    // 尝试使用备用方案
    if (fallbackCopyTextToClipboard(props.code)) {
      if ($toast) {
        $toast(`已复制${props.prompt}`)
      } else {
        showInternalToast(`已复制${props.prompt}`)
      }
    } else {
      if ($toast) {
        $toast('复制失败，请重试')
      } else {
        showInternalToast('复制失败，请重试')
      }
    }
  }
}

// 备用复制方法
function fallbackCopyTextToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('备用复制方法失败:', err);
    return false;
  }
}

// 内置Toast实现（作为备选方案）
function showInternalToast(message: string) {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#8b5a8c';
    toast.style.color = 'white';
    toast.style.padding = '0.8rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(toast);

    // 淡入效果
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // 3秒后自动移除
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}
</script>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  background: rgba(139, 90, 140, 0.1);
  border: 1px solid rgba(139, 90, 140, 0.2);
  color: #8b5a8c;
  padding: 0.5rem 1rem; /* 增加内边距 */
  border-radius: 8px; /* 增加圆角 */
  font-size: 0.9rem; /* 增大字体 */
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.copy-button:hover {
  background: rgba(139, 90, 140, 0.2);
  border-color: rgba(139, 90, 140, 0.3);
  transform: translateY(-2px); /* 增加悬停效果 */
  box-shadow: 0 4px 8px rgba(139, 90, 140, 0.1); /* 添加阴影效果 */
}

.copy-button:active {
  transform: translateY(0);
}

.mr-1 {
  margin-right: 0.25rem;
}
</style>