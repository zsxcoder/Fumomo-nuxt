<template>
  <div class="sponsor-badge">
    <div class="badge-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <span class="badge-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '赞助者'
})
</script>

<style scoped>
.sponsor-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(224, 14, 120, 0.1));
  color: #be185d;
  font-size: 12px;
  font-weight: 500;
}

.dark .sponsor-badge {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(224, 14, 120, 0.2));
  color: #ec4899;
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
}

.badge-text {
  font-size: 12px;
}
</style>