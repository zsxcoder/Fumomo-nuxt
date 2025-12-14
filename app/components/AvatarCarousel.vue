<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  avatars: {
    type: Array as () => string[],
    required: true
  },
  interval: {
    type: Number,
    default: 3000
  }
})

const currentIndex = ref(0)
let timer: NodeJS.Timeout | null = null

onMounted(() => {
  startCarousel()
})

function startCarousel() {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.avatars.length
  }, props.interval)
}

function stopCarousel() {
  if (timer) clearInterval(timer)
}
</script>

<template>
  <div 
    class="avatar-carousel"
    @mouseenter="stopCarousel"
    @mouseleave="startCarousel"
  >
    <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div 
        v-for="(avatar, index) in avatars" 
        :key="index" 
        class="carousel-item"
      >
        <img 
          :src="avatar" 
          :alt="`Avatar ${index + 1}`" 
          class="carousel-avatar" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-carousel {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100px;
  border-radius: 12px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--c-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .avatar-carousel {
    height: 80px;
  }
  
  .carousel-avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
