<script setup lang="ts">
import { siteConfig } from "../config";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import GiscusComments from '~/components/GiscusComments.vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

// 配置dayjs
dayjs.extend(relativeTime);

// 配置marked代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

// 页面配置
const pageConfig = {
    title: "随笔",
    description: "记录生活点滴，一些想法和生活"
};

// 使用全局Toast函数
const { $toast } = useNuxtApp();

// 设置页面元数据
useHead({
    title: `${pageConfig.title} - ${siteConfig.site.title}`,
    meta: [
        { name: 'description', content: pageConfig.description },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${siteConfig.site.url}/moments` },
        { property: 'og:title', content: `${pageConfig.title} - ${siteConfig.site.title}` },
        { property: 'og:description', content: pageConfig.description },
        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: `${siteConfig.site.url}/moments` },
        { property: 'twitter:title', content: `${pageConfig.title} - ${siteConfig.site.title}` },
        { property: 'twitter:description', content: pageConfig.description }
    ]
});

// 分散动画相关
const essaysSectionRef = ref(null);
const showDisperse = ref(false);
const scrollProgress = ref(0);
const atBottom = ref(false);

// 检测是否为移动设备
const isMobile = ref(false);

// 获取颜色模式
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

// API配置
const API_CONFIG = {
    POSTS_API: 'https://moment.20050815.xyz/api/posts',
    PAGE_SIZE: 30,
};

// 默认用户信息
const DEFAULT_USER = {
    username: '钟神秀',
    nickname: '钟神秀',
    avatarUrl: 'https://imgbed.mcyzsx.top/file/avatar/1765626136745_zsxcoder.jpg',
    slogan: '记录生活点滴，一些想法和生活'
};

// 用户信息状态
const userState = ref({
    loading: false,
    error: false,
    data: DEFAULT_USER,
});

// 动态列表状态
const essaysState = ref({
    essays: [] as Array<{
        id: string;
        title: string;
        content: string;
        renderedContent: string;
        images: string[];
        tags: string[];
        date: string;
        updatedAt: string | null;
        user?: {
            username: string;
            nickname: string;
            avatarUrl: string;
        };
    }>,
    loading: true,
    error: false,
    lastFetchTime: 0,
});

// 计算属性
const user = computed(() => userState.value.data);
const essays = computed(() => essaysState.value.essays);
const combinedLoading = computed(() => essaysState.value.loading || userState.value.loading);
const combinedError = computed(() => essaysState.value.error || userState.value.error);

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
    // 只有当已经到达底部并且再次向下滚动时才触发分散动画
    if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
        event.preventDefault();
        showDisperse.value = true;

        // 延迟导航到友链页面
        setTimeout(() => {
            navigateTo("/friends");
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

// 提取markdown中的图片
function extractImages(content: string): string[] {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        images.push(match[1]);
    }
    return images;
}

// 获取动态列表
async function fetchEssays() {
    // 如果距离上次获取时间小于30分钟，则使用缓存
    const now = Date.now();
    if (now - essaysState.value.lastFetchTime < 30 * 60 * 1000) {
        return;
    }

    try {
        essaysState.value.loading = true;
        essaysState.value.error = false;

        const data = await $fetch<{ success: boolean; data?: any[]; count?: number }>(
            `${API_CONFIG.POSTS_API}?size=${API_CONFIG.PAGE_SIZE}`,
            {
                method: 'GET',
            }
        );

        if (data.success && data.data) {
            const formattedEssays = data.data.map((item: any) => {
                const images = extractImages(item.content);
                // 移除 markdown 中的图片语法，只保留九宫格显示
                const contentWithoutImages = item.content.replace(/!\[.*?\]\(.*?\)/g, '');
                const renderedContent = marked.parse(contentWithoutImages);

                return {
                    id: item.id,
                    title: item.title || '',
                    content: item.content,
                    renderedContent,
                    images,
                    tags: Array.isArray(item.tags) ? item.tags : [],
                    date: item.date,
                    updatedAt: item.updatedAt,
                    user: {
                        username: DEFAULT_USER.username,
                        nickname: DEFAULT_USER.nickname,
                        avatarUrl: DEFAULT_USER.avatarUrl,
                    },
                };
            });

            essaysState.value.essays = formattedEssays;
            essaysState.value.lastFetchTime = Date.now();
        }
    } catch (err) {
        console.error('Error fetching essays:', err);
        essaysState.value.error = true;
    } finally {
        essaysState.value.loading = false;
    }
}

// 加载外部脚本
function loadExternalScripts() {
    if (import.meta.client) {
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    return resolve(null);
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        loadScript('https://jsd.myxz.top/npm/aplayer/dist/APlayer.min.js')
            .catch(err => console.error('APlayer脚本加载失败:', err));
        loadScript('https://jsd.myxz.top/npm/meting@2/dist/Meting.min.js')
            .catch(err => console.error('Meting脚本加载失败:', err));
    }
}

// 初始化
onMounted(() => {
    // 检测是否为移动设备
    isMobile.value = window.innerWidth < 768;
    
    // 获取数据
    fetchEssays();
    
    // 添加事件监听器
    if (import.meta.client) {
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        
        if (!isMobile.value && siteConfig.theme.scrollNavigation) {
            window.addEventListener("wheel", handleWheel, { passive: false });
        }
    }
});

// 清理事件监听器
onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        
        if (!isMobile.value && siteConfig.theme.scrollNavigation) {
            window.removeEventListener("wheel", handleWheel);
        }
        
        // 关闭fancybox
        Fancybox.close();
    }
});

// 获取随笔摘要内容（用于引用）
function getEssaySummary(item: any): string {
    // 从原始 content 获取纯文本
    const textContent = item.content
        .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // 移除图片链接
        .replace(/```[\s\S]*?```/g, '[代码]') // 移除代码块
        .replace(/`[^`]+`/g, '') // 移除行内代码
        .replace(/\[.*?\]\(.*?\)/g, '$1') // 提取链接文本
        .replace(/[#*`_~\[\]()]/g, '') // 移除 markdown 标记
        .trim();
    
    // 如果内容过长，截取前100个字符
    return textContent.length > 100 
        ? textContent.substring(0, 100) + '...' 
        : textContent;
}

// 管理当前被引用的随笔
const referencedEssay = ref<{
    index: number;
    content: string;
  } | null>(null);

// 滚动到评论区
const scrollToComments = () => {
    nextTick(() => {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
};

// 处理点击评论按钮
const handleCommentClick = (index: number, content: string) => {
    referencedEssay.value = { index, content };
    scrollToComments();
};

// 打开图片灯箱
const openImageViewer = (images: string[], index: number) => {
    if (import.meta.client) {
        const items = images.map(src => ({ src, type: 'image' }));
        
        Fancybox.show(items, {
            startIndex: index,
            Thumbs: {
                type: 'classic',
            },
            Toolbar: {
                display: {
                    left: ['infobar'],
                    middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
                    right: ['slideshow', 'thumbs', 'close'],
                },
            },
        });
    }
};
</script>

<template>
    <div>
        <main class="flex flex-col items-center min-h-screen essays-page pt-24" :class="{ dispersed: showDisperse }">
            <section
                ref="essaysSectionRef"
                class="bg-white rounded-3xl shadow-lg p-8 max-w-4xl w-full mb-12 component-card"
                style="box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08)"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
                <p class="text-muted text-xl text-center mb-8">
                    {{ pageConfig.description }}
                </p>

                <!-- 加载状态 -->
                <div v-if="combinedLoading" class="flex justify-center items-center py-16">
                    <div class="steam-loading-container">
                        <div class="steam-loading-header">
                            加载数据中...
                        </div>
                        <div class="steam-progress-bar">
                            <div
                                class="steam-progress"
                                :style="{ width: `${Math.min((userState.loading ? 0.5 : 0) + (essaysState.loading ? 0.5 : 0), 1) * 100}%` }"
                            />
                        </div>
                        <p class="steam-loading-subtext">
                            正在获取随笔数据...
                        </p>
                    </div>
                </div>

                <!-- 加载错误 -->
                <div v-else-if="combinedError" class="text-center py-16">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <p class="text-red-500 text-lg mb-4">随笔加载失败</p>
                    <p class="text-muted">请刷新页面重试</p>
                </div>

                <!-- 动态列表 -->
                <div v-else class="essay-content">
                    <!-- 用户资料区域 -->
                    <div class="profile">
                        <div class="header">
                            <img
                                class="avatar"
                                :src="user?.avatarUrl || 'https://imgbed.mcyzsx.top/file/avatar/1765626136745_zsxcoder.jpg'"
                                :alt="user?.nickname || '用户头像'"
                            >
                            <div class="info">
                                <div class="row">
                                    <h2 class="username">
                                        {{ user?.nickname || user?.username || '用户' }}
                                        <i class="fas fa-check-circle verified"></i>
                                    </h2>
                                </div>
                                <div v-if="user" class="row">
                                    <span class="bio">{{ user?.slogan || '这个人很懒，什么都没留下' }}</span>
                                </div>
                                <span v-if="essays.length > 0" class="bio">
                                    更新时间：{{ dayjs(essays[0].date).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 统计卡片区域 -->
                    <div class="overview">
                        <div class="stat-card">
                            <i class="fas fa-edit stat-icon text-primary"></i>
                            <div class="stat-info">
                                <div class="stat-label">总发布</div>
                                <div class="stat-value">{{ essays.length }}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-tags stat-icon text-primary"></i>
                            <div class="stat-info">
                                <div class="stat-label">总标签</div>
                                <div v-if="essays.length > 0" class="stat-value">
                                    {{ essays[0].tags.length }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 动态列表 -->
                    <div class="essays-list">
                        <div
                            v-for="(item, index) in essays"
                            :key="item.id || index"
                            class="essay-item"
                            :style="{ '--delay': `${index * 0.1}s` }"
                        >
                            <!-- 动态头部 -->
                            <div class="essay-meta">
                                <img
                                    class="avatar"
                                    :src="item.user?.avatarUrl || user?.avatarUrl"
                                    :alt="item.user?.nickname"
                                >
                                <div class="info">
                                    <div class="essay-nick">
                                        {{ item.user?.nickname || user?.nickname }}
                                        <i class="fas fa-check-circle verified"></i>
                                    </div>
                                    <div class="essay-date">
                                        {{ dayjs(item.date).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}
                                    </div>
                                </div>
                            </div>

                            <!-- 动态内容 -->
                            <div class="essay-content-item">
                                <!-- Markdown渲染内容 -->
                                <div 
                                    class="markdown-content" 
                                    v-html="item.renderedContent"
                                />

                                <!-- 图片展示 - 九宫格 -->
                                <div v-if="item.images.length" class="zone_imgbox">
                                    <div
                                        v-for="(img, imgIndex) in item.images"
                                        :key="imgIndex"
                                        class="img-item"
                                    >
                                        <img
                                            :src="img"
                                            class="essay-img"
                                            loading="lazy"
                                            :fetchpriority="imgIndex === 0 ? 'high' : 'low'"
                                            @click="openImageViewer(item.images, imgIndex)"
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- 底部区域 -->
                            <div class="essay-bottom">
                                <div class="essay-tags">
                                    <span class="tag">
                                        🏷️{{ Array.isArray(item.tags) ? item.tags.join(', ') : item.tags }}
                                    </span>
                                </div>
                                
                                <!-- 评论按钮 -->
                                <button 
                                    class="comment-button"
                                    @click="handleCommentClick(index, getEssaySummary(item))"
                                >
                                    <i class="fas fa-comments"></i>
                                    评论
                                </button>
                            </div>
                        </div>

                        <!-- 底部提示 -->
                        <div class="essays-footer">
                            <p>仅显示最近 30 条记录</p>
                        </div>
                    </div>

                    <!-- 统一评论区 -->
                    <div id="comments-section" class="comments-section">
                        <div class="comments-header">
                            <h3 class="comments-title">
                                <i class="fas fa-comments"></i>
                                评论区
                            </h3>
                            <div v-if="referencedEssay" class="referenced-essay-info">
                                <span class="reference-indicator">正在评论: 随笔 #{{ referencedEssay.index + 1 }}</span>
                                <button 
                                    class="clear-reference-btn"
                                    @click="referencedEssay = null"
                                    title="清除引用"
                                >
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <GiscusComments
  essay-id="essays-page-comments"
  :essay-content="referencedEssay?.content || ''"
  :theme="isDark ? 'transparent_dark' : 'light'"
  :default-show="true"
/>
                    </div>
                </div>
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
                        {{ atBottom ? "再向下滚动进入友链页" : "滚动到底部" }}
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
/* 随笔页面特定样式 */
.essays-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
}

/* 分散动画样式 */
.essays-page.dispersed .component-card {
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

/* Steam 风格加载页 */
.steam-loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #333;
    gap: 16px;
}

/* 用户资料区域 */
.profile {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
    transition: border-color 0.3s;
}

.header {
    align-items: flex-start;
    display: flex;
    gap: 1em;
}

.avatar {
    flex-shrink: 0;
    height: 100px;
    object-fit: cover;
    width: 100px;
    border: 2px solid #8b5a8c;
    border-radius: 50%;
}

.info {
    min-width: 0px;
    flex: 1 1 0%;
}

.row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.5em;
    gap: 0.75em;
}

.username {
    color: #333;
    font-size: 1.25em;
    font-weight: 600;
    word-break: break-word;
    margin: 0px;
}

.verified {
    color: #8b5a8c;
    font-size: 16px;
    margin-left: 4px;
}

.bio {
    color: #666;
    font-size: 0.9rem;
}

/* 统计卡片区域 */
.overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.stat-card {
    background: #f9fafb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 0.5rem;
    transition: border-color 0.3s;
    align-items: center;
}

.stat-icon {
    font-size: 1.8rem;
    color: #8b5a8c;
}

.stat-info .stat-label {
    font-size: 0.9rem;
    color: #666;
}

.stat-info .stat-value {
    font-size: 1.4rem;
    font-weight: bold;
    color: #333;
}

.steam-loading-header {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--tw-prose-body);
}

.steam-progress-bar {
    width: 80%;
    height: 5px;
    background-color: #e5e7eb;
    border-radius: 5px;
    overflow: hidden;
}

.steam-progress {
    height: 100%;
    background-color: #8b5a8c;
    transition: width 0.3s ease;
}

.steam-loading-subtext {
    font-size: 0.9rem;
    color: #666;
}

/* 动态列表 */
.essays-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.essay-item {
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: float-in 0.3s backwards;
    animation-delay: var(--delay);
}

@keyframes float-in {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 动态头部 */
.essay-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}

.essay-meta .avatar {
    width: 3em;
    height: 3em;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
}

.essay-nick {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #333;
    font-weight: 500;
}

.essay-date {
    font-size: 0.8rem;
    color: #999;
    font-family: monospace;
}

/* 动态内容 */
.essay-content-item {
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #555;
}

/* Markdown 内容样式 */
.markdown-content {
    font-size: 0.95rem;
    word-wrap: break-word;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: #333;
}

.markdown-content :deep(p) {
    margin-bottom: 0.5em;
}

.markdown-content :deep(a) {
    margin: 0 -0.1em;
    padding: 0 0.1em;
    background: linear-gradient(rgba(139, 90, 140, 0.1), rgba(139, 90, 140, 0.1)) no-repeat center bottom / 100% 0.1em;
    color: #8b5a8c;
    text-decoration: none;
    transition: all 0.2s;
}

.markdown-content :deep(a:hover) {
    border-radius: 0.3em;
    background-size: 100% 100%;
}

.markdown-content :deep(code) {
    background-color: #f3f4f6;
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-size: 0.9em;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.markdown-content :deep(pre) {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 1em;
    overflow-x: auto;
    margin: 0.5em 0;
}

.markdown-content :deep(pre code) {
    background-color: transparent;
    padding: 0;
    color: #d4d4d4;
}

.markdown-content :deep(blockquote) {
    border-left: 4px solid #8b5a8c;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #666;
    font-style: italic;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.markdown-content :deep(li) {
    margin: 0.25em 0;
}

.markdown-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

/* 九宫格图片展示 - 尺寸减少1/3 */
.zone_imgbox {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
}

.img-item {
    position: relative;
    padding-bottom: 66.67%; /* 减少尺寸1/3: 100% * 2/3 = 66.67% */
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
}

.essay-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.essay-img:hover {
    transform: scale(1.05);
}

/* Fancybox 样式 */
:deep(.fancybox__container) {
    --fancybox-bg: rgba(0, 0, 0, 0.9);
    z-index: 9999;
}

:deep(.f-button.is-prev),
:deep(.f-button.is-next) {
    color: #fff;
}

:deep(.fancybox__toolbar) {
    background: rgba(0, 0, 0, 0.5);
}

/* 底部区域 */
.essay-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999;
}

.comment-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    background: rgba(139, 90, 140, 0.1);
    border: 1px solid rgba(139, 90, 140, 0.2);
    border-radius: 8px;
    color: #8b5a8c;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
    white-space: nowrap;
}

.comment-button:hover {
    background: rgba(139, 90, 140, 0.2);
    transform: translateY(-1px);
}

.dark .comment-button {
    background: rgba(194, 145, 204, 0.15);
    border-color: rgba(194, 145, 204, 0.3);
    color: #c291cc;
}

.dark .comment-button:hover {
    background: rgba(194, 145, 204, 0.25);
}

/* 统一评论区 */
.comments-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(139, 90, 140, 0.2);
}

.comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.comments-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #8b5a8c;
    margin: 0;
    font-family: 'Comic Sans MS', 'XiaokeNailao', cursive, sans-serif;
}

.dark .comments-title {
    color: #c291cc;
}

.referenced-essay-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(139, 90, 140, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #8b5a8c;
}

.dark .referenced-essay-info {
    background: rgba(194, 145, 204, 0.15);
    color: #c291cc;
}

.reference-indicator {
    font-weight: 500;
}

.clear-reference-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: rgba(139, 90, 140, 0.2);
    border: none;
    border-radius: 50%;
    color: #8b5a8c;
    cursor: pointer;
    transition: all 0.2s ease;
}

.clear-reference-btn:hover {
    background: rgba(139, 90, 140, 0.3);
}

.dark .clear-reference-btn {
    background: rgba(194, 145, 204, 0.3);
    color: #c291cc;
}

.dark .clear-reference-btn:hover {
    background: rgba(194, 145, 204, 0.4);
}

.essay-tags {
    display: flex;
    gap: 4px;
    font-size: 0.7rem;
}

.tag,
.location {
    background-color: #f3f4f6;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    padding: 2px 4px;
    transition: all 0.2s;
}

.tag:hover,
.location:hover {
    opacity: 0.8;
}

.location {
    color: #8b5a8c;
}

.location-icon {
    margin-right: 2px;
}

/* 底部提示 */
.essays-footer {
    text-align: center;
    padding: 2rem 0;
    color: #999;
    font-size: 0.9rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .component-card {
        padding: 1.5rem;
    }

    .overview {
        grid-template-columns: repeat(2, 1fr);
    }

    .zone_imgbox {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 深色模式适配 */
.dark .steam-loading-container {
    color: #e5e7eb;
}

.dark .steam-loading-header {
    color: #f3f4f6;
}

.dark .steam-progress-bar {
    background-color: #374151;
}

.dark .steam-progress {
    background-color: #a974a9;
}

.dark .steam-loading-subtext {
    color: #9ca3af;
}

/* 用户资料区域深色模式 */
.dark .profile {
    background: rgba(31, 41, 55, 0.8);
    border-color: rgba(75, 85, 99, 0.3);
}

.dark .avatar {
    border-color: #a974a9;
}

.dark .username {
    color: #f3f4f6;
}

.dark .verified {
    color: #a974a9;
}

.dark .bio {
    color: #d1d5db;
}

/* 统计卡片深色模式 */
.dark .stat-card {
    background: rgba(31, 41, 55, 0.8);
    border-color: rgba(75, 85, 99, 0.3);
}

.dark .stat-icon {
    color: #a974a9;
}

.dark .stat-info .stat-label {
    color: #9ca3af;
}

.dark .stat-info .stat-value {
    color: #f3f4f6;
}

/* 动态项深色模式 */
.dark .essay-item {
    background: rgba(31, 41, 55, 0.8);
    border-color: rgba(75, 85, 99, 0.3);
}

.dark .essay-meta {
    color: #e5e7eb;
}

.dark .essay-nick {
    color: #f3f4f6;
}

.dark .essay-nick .verified {
    color: #a974a9;
}

.dark .essay-date {
    color: #9ca3af;
}

.dark .essay-content-item {
    color: #e5e7eb;
}

/* Markdown 深色模式 */
.dark .markdown-content :deep(h1),
.dark .markdown-content :deep(h2),
.dark .markdown-content :deep(h3),
.dark .markdown-content :deep(h4),
.dark .markdown-content :deep(h5),
.dark .markdown-content :deep(h6) {
    color: #f3f4f6;
}

.dark .markdown-content :deep(code) {
    background-color: #374151;
    color: #e5e7eb;
}

.dark .markdown-content :deep(blockquote) {
    border-left-color: #a974a9;
    color: #d1d5db;
}

.dark .markdown-content :deep(a) {
    background: linear-gradient(rgba(169, 116, 169, 0.2), rgba(169, 116, 169, 0.2)) no-repeat center bottom / 100% 0.1em;
    color: #a974a9;
}

.dark .markdown-content :deep(a:hover) {
    border-radius: 0.3em;
    background-size: 100% 100%;
}

/* 底部区域深色模式 */
.dark .essay-bottom {
    color: #9ca3af;
}

.dark .tag,
.dark .location {
    background-color: rgba(139, 90, 140, 0.2);
}

.dark .location {
    color: #a974a9;
}

/* 底部提示深色模式 */
.dark .essays-footer {
    color: #9ca3af;
}
</style>