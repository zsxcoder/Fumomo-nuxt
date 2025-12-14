<script setup lang="ts">
// Footer组件 - 统一的页脚
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="py-8 text-center bg-primary/10 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-screen-xl mx-auto px-4">
      <p class="text-xl font-fumofumo m-0 opacity-80 text-primary dark:text-primary-light">Fumomo - 简约而不简单</p>
      <p class="text-sm mt-2 text-muted dark:text-gray-300">© {{ currentYear }} Fumomo. 保留所有权利。</p>
      <p class="text-sm mt-1 text-muted dark:text-gray-300">
        Powered by 
        <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="hover:underline transition-all duration-300 text-primary dark:text-primary-light">Nuxt</a> &
        <a href="https://github.com/Hakutyan-bai/fumomo-nuxt" target="_blank" rel="noopener noreferrer" class="hover:underline transition-all duration-300 text-primary dark:text-primary-light">Fumomo</a>
      </p>
    </div>
  </footer>
</template>
