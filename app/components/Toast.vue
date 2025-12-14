<template>
  <Teleport to="body">
    <transition name="toast">
      <div
        v-if="visible"
        class="toast-notification"
      >
        {{ message }}
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  message: string;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
});

const visible = ref(false);

// 监听消息变化，显示通知
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true;
    
    // 指定时间后自动隐藏
    setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
}, { immediate: true });
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--c-primary, #8b5a8c);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  z-index: 9999;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
}
</style>