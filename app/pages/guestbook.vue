<script setup lang="ts">
useSeoMeta({
  title: '留言板',
  description: '在这里留下你的想法和建议',
})

// 当前页面标识
const currentPage = 'guestbook'
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <div class="max-w-4xl mx-auto px-6 py-12">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold font-fumofumo mb-4 text-primary dark:text-primary-light">
            留言板
          </h1>
          <p class="text-lg md:text-xl text-muted dark:text-gray-300 max-w-2xl mx-auto">
            在这里留下你的建议或者想和我说的话
          </p>
        </div>
      </div>
    </header>

    <main class="page-content">
      <div class="max-w-4xl mx-auto px-6 pb-16">
        <div class="welcome-card card">
          <div class="welcome-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 16 16" fill="none" class="text-5xl text-primary dark:text-primary-light">
              <g fill="none">
                <g clip-path="url(#wave-clip)">
                  <path fill="currentColor" fill-rule="evenodd" d="M6 3.325v5.971l-1.5-.375l-.53-.132l-.672-.168l-.205-.051a.478.478 0 0 0-.409.84l.167.13l.547.425l.43.334l2.142 1.666l2.728-.181L12 11.5l.667-3.557l.108-.579l.455-2.426l.148-.787l.009-.047a.51.51 0 0 0-.993-.234l-.013.046l-.22.77L12 5.25L11.5 7h-1V2.023a.523.523 0 0 0-1.043-.048l-.005.048l-.07.775l-.216 2.381l-.147 1.617L9 7H8l-.019-.093l-.329-1.647L7.5 4.5l-.26-1.298l-.13-.652l-.022-.108A.55.55 0 0 0 6 2.55zm-2.543 3.79l1.043.26V2.55a2.05 2.05 0 0 1 3.617-1.321A2.023 2.023 0 0 1 12 2.023v.182a2.01 2.01 0 0 1 2.861 2.176l-1.387 7.395a1.5 1.5 0 0 1-1.346 1.219l-3.302.283l-.028.002l-2.728.182a1.5 1.5 0 0 1-1.02-.313l-3.287-2.555a1.978 1.978 0 0 1 1.694-3.48m9.346 8.383a.75.75 0 0 0-.106-1.496l-7 .5a.75.75 0 1 0 .106 1.496z" clip-rule="evenodd"/>
                </g>
                <defs>
                  <clipPath id="wave-clip">
                    <path fill="currentColor" d="M0 0h16v16H0z"/>
                  </clipPath>
                </defs>
              </g>
            </svg>
          </div>
          <div class="welcome-text">
            <h3 class="text-2xl font-bold mb-4 text-primary dark:text-primary-light">欢迎来到留言板</h3>
            <p class="text-muted dark:text-gray-300 mb-4">这里是大家交流想法、分享心得的地方。你可以：</p>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-muted dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary dark:text-primary-light">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>留下对网站的建议和反馈</span>
              </li>
              <li class="flex items-center gap-2 text-muted dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary dark:text-primary-light">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <span>分享有趣的想法和见解</span>
              </li>
              <li class="flex items-center gap-2 text-muted dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary dark:text-primary-light">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>与其他访客进行友好交流</span>
              </li>
              <li class="flex items-center gap-2 text-muted dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary dark:text-primary-light">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>提出你的疑问和问题</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="notice my-6 p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border-l-4 border-primary">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary dark:text-primary-light">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span class="text-sm text-muted dark:text-gray-300">
              请文明留言，共同维护良好的交流环境
            </span>
          </div>
        </div>

        <section class="comment-section">
          <h3 class="text-2xl font-bold font-fumofumo mb-6 text-center text-primary dark:text-primary-light">
            评论区
          </h3>
          <div class="giscus-container">
            <GiscusComments 
              :essay-id="'guestbook'" 
              essay-content="留言板 - 在这里留下你的想法和建议"
              :default-show="true"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  min-height: calc(100vh - var(--header-height, 80px));
}

.page-header {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.05) 0%, rgba(255, 238, 248, 0.1) 100%);
  border-bottom: 1px solid rgba(139, 90, 140, 0.1);
}

.dark .page-header {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%);
  border-bottom-color: rgba(139, 90, 140, 0.2);
}

.page-content {
  padding-top: 2rem;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(139, 90, 140, 0.08);
  border: 1px solid rgba(139, 90, 140, 0.1);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  md:flex;
  gap: 2rem;
  align-items: flex-start;
}

.dark .welcome-card {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(139, 90, 140, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.welcome-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 90, 140, 0.12);
}

.dark .welcome-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.welcome-icon {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.1) 0%, rgba(255, 238, 248, 0.2) 100%);
  box-shadow: 0 4px 15px rgba(139, 90, 140, 0.1);
}

.dark .welcome-icon {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.2) 0%, rgba(31, 41, 55, 0.8) 100%);
  box-shadow: 0 4px 15px rgba(139, 90, 140, 0.2);
}

.welcome-text {
  flex: 1;
}

.welcome-text h3 {
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
  color: #8b5a8c;
}

.dark .welcome-text h3 {
  color: #c291cc;
}

.welcome-text ul {
  padding-left: 0;
  list-style: none;
}

.notice {
  border-radius: 8px;
  font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
}

/* 深色模式适配 */
.dark .page-header {
  background: linear-gradient(135deg, rgba(139, 90, 140, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%);
  border-bottom-color: rgba(139, 90, 140, 0.2);
}

.dark .welcome-card {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.3);
}

.dark .welcome-text p {
  color: #d1d5db;
}

.dark .welcome-text ul li {
  color: #d1d5db;
}

.dark .notice {
  background-color: rgba(139, 90, 140, 0.2);
  border-color: rgba(139, 90, 140, 0.3);
  color: #d1d5db;
}

.comment-section {
  margin-top: 3rem;
}

.giscus-container {
    margin-top: 1rem;
    background: rgba(249, 250, 251, 0.8);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(139, 90, 140, 0.1);
    box-shadow: 0 2px 12px rgba(139, 90, 140, 0.05);
    transition: all 0.3s ease; /* 添加过渡动画 */
}

.dark .giscus-container {
    background: rgba(31, 41, 55, 0.8) !important; /* 深色模式下的背景 */
    border-color: rgba(139, 90, 140, 0.2) !important; /* 深色模式下的边框颜色 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important; /* 深色模式下的阴影效果 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .welcome-icon {
    width: 80px;
    height: 80px;
    align-self: center;
  }
  
  .welcome-text h3 {
    font-size: 1.5rem;
  }
}
</style>