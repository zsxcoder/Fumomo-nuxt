<script setup lang="ts">
import { siteConfig } from "../config";

// 页面配置
const pageConfig = {
    title: "友链朋友圈",
    description: "朋友们的最新文章"
};

// 设置页面元数据
useHead({
    title: `${pageConfig.title} - ${siteConfig.site.title}`
});

// 分散动画相关
const fcircleSectionRef = ref(null);
const showDisperse = ref(false);
const scrollProgress = ref(0);
const atBottom = ref(false);

// 检测是否为移动设备
const isMobile = ref(false);

// 加载状态
const isLoading = ref(true);
const loadError = ref(false);
const fcircleLoadTimeout = ref<NodeJS.Timeout | null>(null);
const checkInterval = ref<NodeJS.Timeout | null>(null);

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
    // 只有当已经到达底部并且再次向下滚动时才触发分散动画
    if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
        event.preventDefault();
        showDisperse.value = true;

        // 延迟导航到网站页
        setTimeout(() => {
            navigateTo("/website");
        }, 1000);
    }
};

const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 计算滚动进度
    const maxScroll = docHeight - windowHeight;
    if (maxScroll > 0) {
        scrollProgress.value = Math.min((scrollTop / maxScroll) * 100, 100);
    }

    // 检查是否滚动到底部
    const isAtBottom = scrollTop + windowHeight >= docHeight - 10;
    atBottom.value = isAtBottom;
};

// 处理窗口大小变化
const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

// 检查Friend Circle Lite是否已加载
const checkFriendCircleLoaded = () => {
    const fcContainer = document.querySelector('#friend-circle-lite-root');
    if (fcContainer && fcContainer.children.length > 0) {
        isLoading.value = false;
        if (checkInterval.value) {
            clearInterval(checkInterval.value);
            checkInterval.value = null;
        }
        if (fcircleLoadTimeout.value) {
            clearTimeout(fcircleLoadTimeout.value);
            fcircleLoadTimeout.value = null;
        }
    }
};

// 加载Friend Circle Lite资源
const loadFriendCircleResources = () => {
    // 配置Friend Circle Lite
    if (typeof window.UserConfig === 'undefined') {
        window.UserConfig = {
            private_api_url: 'https://fc.mcyzsx.top/',
            page_turning_number: 20,
            error_img: 'https://i.p-i.vip/30/20240815-66bced9226a36.webp',
        };
    }
    
    // 动态加载CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite/main/fclite.min.css';
    document.head.appendChild(linkElement);
    
    // 动态加载JS，添加错误处理
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite/main/fclite.min.js';
    scriptElement.onload = () => {
        console.log('Friend Circle Lite script loaded successfully');
        // 延迟检查，确保脚本完全初始化
        setTimeout(() => {
            // 立即检查一次
            checkFriendCircleLoaded();
            
            // 然后每秒检查一次，最多5秒
            checkInterval.value = setInterval(() => {
                checkFriendCircleLoaded();
            }, 1000);
        }, 500);
    };
    scriptElement.onerror = () => {
        console.error('Failed to load Friend Circle Lite script');
        loadError.value = true;
        isLoading.value = false;
    };
    document.body.appendChild(scriptElement);
};

// 合并的初始化函数
const initializePage = () => {
    // 检测是否为移动设备
    isMobile.value =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
    
    // 设置加载超时（10秒）
    fcircleLoadTimeout.value = setTimeout(() => {
        if (isLoading.value) {
            loadError.value = true;
            isLoading.value = false;
            if (checkInterval.value) {
                clearInterval(checkInterval.value);
                checkInterval.value = null;
            }
        }
    }, 10000);
    
    // 加载Friend Circle Lite资源
    loadFriendCircleResources();
};

// 统一的事件监听器管理
onMounted(() => {
    if (import.meta.client) {
        // 初始化页面
        initializePage();
        
        // 添加事件监听器
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        
        if (!isMobile.value && siteConfig.theme.scrollNavigation) {
            window.addEventListener("wheel", handleWheel, { passive: false });
        }
    }
});

// 清理事件监听器和定时器
onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("wheel", handleWheel);
        
        // 清理定时器
        if (checkInterval.value) {
            clearInterval(checkInterval.value);
        }
        if (fcircleLoadTimeout.value) {
            clearTimeout(fcircleLoadTimeout.value);
        }
    }
});
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen fcircle-page pt-24" :class="{ dispersed: showDisperse }">
            <section
                ref="fcircleSectionRef"
                class="bg-white rounded-3xl shadow-lg p-8 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
                <p class="text-muted text-xl text-center mb-8">
                    {{ pageConfig.description }}
                </p>

                <!-- 加载状态 -->
                <div v-if="isLoading" class="flex justify-center items-center py-16">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <span class="ml-3 text-muted">正在加载友链朋友圈...</span>
                </div>

                <!-- 加载错误 -->
                <div v-else-if="loadError" class="text-center py-16">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <p class="text-red-500 text-lg mb-4">友链朋友圈加载失败</p>
                    <p class="text-muted">请检查网络连接或稍后再试</p>
                </div>

                <!-- 友链朋友圈容器 -->
                <ClientOnly>
                    <div 
                        v-show="!isLoading && !loadError"
                        id="friend-circle-lite-root"
                        class="min-h-[500px]"
                    ></div>
                </ClientOnly>
            </section>

            <!-- 滚动提示和进度指示器 -->
            <div
                v-if="!showDisperse && !isMobile && siteConfig.theme.scrollNavigation"
                class="fixed bottom-8 right-8 text-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
                <div class="mb-4" :class="atBottom ? 'animate-pulse' : 'animate-bounce'">
                    <i
                        class="text-2xl mb-2 block"
                        :class="atBottom ? 'fas fa-arrow-down text-green-500' : 'fas fa-mouse text-primary'"
                    ></i>
                    <p class="text-sm text-muted">
                        {{ atBottom ? "再向下滚动进入网站页" : "滚动到底部" }}
                    </p>
                </div>

                <!-- 滚动进度条 -->
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full transition-all duration-150 ease-out rounded-full"
                        :class="atBottom ? 'bg-green-500' : 'bg-primary'"
                        :style="{ width: scrollProgress + '%' }"
                    ></div>
                </div>
                <div class="text-xs text-muted mt-1">
                    {{ Math.round(scrollProgress) }}%
                    <span v-if="atBottom" class="text-green-600 ml-1">✓ 已到底部</span>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* 友链朋友圈页面特定样式 */
.fcircle-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

.fcircle-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
}

/* 分散动画样式 */
.fcircle-page.dispersed .component-card {
    animation: scatterCenter 1s ease-out forwards;
}

@keyframes scatterCenter {
    0% {
        transform: translateX(0) translateY(0) rotateZ(0deg) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateX(0) translateY(-100vh) rotateZ(180deg) scale(0.2);
        opacity: 0;
    }
}

/* 友链朋友圈容器样式调整 */
#friend-circle-lite-root {
    overflow: hidden;
    border-radius: 12px;
}

/* 覆盖Friend Circle Lite的默认样式以适应网站主题 */
:deep(.fclite-container) {
    font-family: inherit;
}

:deep(.fclite-item) {
    border-radius: 12px;
    transition: all 0.2s ease;
    border: 1px solid rgba(139, 90, 140, 0.1);
}

:deep(.fclite-item:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

:deep(.fclite-avatar) {
    border-radius: 50%;
    border: 2px solid rgba(139, 90, 140, 0.2);
}

:deep(.fclite-more) {
    background-color: rgba(139, 90, 140, 0.1);
    color: #8b5a8c;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-weight: 500;
    transition: all 0.2s ease;
}

:deep(.fclite-more:hover) {
    background-color: rgba(139, 90, 140, 0.2);
    transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .component-card {
        padding: 1.5rem;
    }
}
</style>