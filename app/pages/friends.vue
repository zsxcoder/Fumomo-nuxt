<script setup lang="ts">
import { siteConfig, getPageConfig } from "../config";

// 页面配置
const pageConfig = getPageConfig("friends");

// 设置页面元数据
definePageMeta({
    title: pageConfig.title,
});

// 定义博主信息
const myFeed = {
    author: "钟神秀",
    title: "ZSXの主页",
    desc: "每一段旅程，都有终点~",
    link: "https://blog.mcyzsx.top",
    avatar: "https://cdn.jsdelivr.net/gh/zsxcoder/picx-images-hosting@master/avatar/zsxcoder.webp"
}

// 定义复制字段
const copyFields = {
    博主: myFeed.author,
    标题: myFeed.title,
    介绍: myFeed.desc,
    网址: myFeed.link,
    头像: myFeed.avatar,
}

// 分散动画相关
const friendsSectionRef = ref(null);
const paginationRef = ref(null);
const showDisperse = ref(false);
const scrollProgress = ref(0);
const atBottom = ref(false);

// 使用全局Toast函数
const { $toast } = useNuxtApp();

// Toast状态管理
const toastMessage = ref('');

// 导入Copy组件
import Copy from "../components/Copy.vue";

// 导入Toast组件
import Toast from "../components/Toast.vue";

// 检测是否为移动设备
const isMobile = ref(false);

// 获取URL参数和路由
const route = useRoute();
const router = useRouter();
const currentPage = computed(() => parseInt((route.query.page as string) || "1"));
const friendsPerPage = 10; // 每页最多显示10个网站

// 表单相关响应式变量
const showApplyForm = ref(false);
const isSubmitting = ref(false);
const showSuccessMessage = ref(false); // 新增成功提示控制

// 友链申请表单数据
const friendRequest = ref({
    siteName: "",
    siteUrl: "",
    description: "",
    email: "",
    avatar: "",
});

const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 计算滚动进度
    const maxScroll = docHeight - windowHeight;
    scrollProgress.value = Math.min((scrollTop / maxScroll) * 100, 100);

    // 检查是否滚动到底部
    const isAtBottom = scrollTop + windowHeight >= docHeight - 10;
    atBottom.value = isAtBottom;
};

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
    // 只有当已经到达底部并且再次向下滚动时才触发分散动画
    if (atBottom.value && event.deltaY > 0 && !showDisperse.value) {
        event.preventDefault();
        showDisperse.value = true;

        // 延迟导航到项目页
        setTimeout(() => {
            navigateTo("/projects");
        }, 1000);
    }
};

// 检测是否为移动设备
onMounted(() => {
    isMobile.value =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
});

// 处理窗口大小变化
const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

// 添加事件监听器
onMounted(() => {
    if (import.meta.client) {
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
    }
    if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
        window.addEventListener("wheel", handleWheel, { passive: false });
    }
});

// 清理事件监听器
onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
    }
    if (import.meta.client && !isMobile.value && siteConfig.theme.scrollNavigation) {
        window.removeEventListener("wheel", handleWheel);
    }
});

// 监听路由变化，切换页码时滚动到顶部
watch(
    () => route.query.page,
    () => {
        // 平滑滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
);

// 网站数据类型
interface Friend {
    title: string;
    description: string;
    avatar: string;
    url: string;
}

// 网站数据
const friends: Friend[] = [
    {
        title: "纸鹿摸鱼处",
        description: "纸鹿至麓不知路，支炉制露不止漉",
        avatar: "https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/image.8ok4l9tqge.webp",
        url: "https://blog.zhilu.site/",
    },
    {
        title: "ATao-Blog",
        description: "做自己喜欢的事",
        avatar: "https://cdn.atao.cyou/Web/Avatar.png",
        url: "https://blog.atao.cyou",
    },
    {
        title: "松坂日记",
        description: "The world is big, you have to go and see",
        avatar: "https://blog.mysqil.com/_astro/avatar.D239-k4C_ZU0B2r.webp",
        url: "https://blog.mysqil.com",
    },
    {
        title: "RyuChan",
        description: "Ciallo～(∠・ω<)⌒★",
        avatar: "https://hub.xiaozhangya.xin/profile.png",
        url: "https://hub.xiaozhangya.xin",
    },
    {
        title: "梦爱吃鱼",
        description: "不负心灵，不负今生。",
        avatar: "https://oss-cdn.bsgun.cn/logo/avatar.256.png",
        url: "https://blog.bsgun.cn/",
    },
    {
        title: "安知鱼",
        description: "生活明朗，万物可爱",
        avatar: "https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg",
        url: "https://blog.anheyu.com/",
    },
    {
        title: "清羽飞扬",
        description: "柳影曳曳，清酒孤灯，扬笔撒墨，心境如霜",
        avatar: "https://blog.liushen.fun/info/avatar.ico",
        url: "https://blog.liushen.fun/",
    },
    {
        title: "Cynosura",
        description: "Trying to light up the dark.",
        avatar: "https://cynosura.one/img/avatar.webp",
        url: "https://cynosura.one/",
    },
];

// 计算分页数据
const allFriends = friends; // 所有友链
const totalItems = computed(() => allFriends.length);
const totalPages = computed(() => Math.ceil(totalItems.value / friendsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * friendsPerPage);
const endIndex = computed(() => startIndex.value + friendsPerPage);
const displayedFriends = computed(() => allFriends.slice(startIndex.value, endIndex.value));

// 表单提交处理
async function submitFriendRequest() {
    if (isSubmitting.value) return; // 防止重复提交
    isSubmitting.value = true;

    try {
        // 发送申请信息到服务器
        const response = await fetch("/api/friend-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(friendRequest.value),
        });

        if (response.ok) {
            // 提交成功，重置表单
            showApplyForm.value = false;
            showSuccessMessage.value = true;
            resetForm();

            // 3秒后隐藏成功消息
            setTimeout(() => {
                showSuccessMessage.value = false;
            }, 3000);
        } else {
            const responseData = await response.json();
            alert("提交失败: " + responseData.message);
        }
    } catch (error) {
        console.error("提交失败:", error);
        alert("提交失败，请检查网络连接后重试");
    } finally {
        isSubmitting.value = false;
    }
}

function resetForm() {
    friendRequest.value = {
        siteName: "",
        siteUrl: "",
        description: "",
        email: "",
        avatar: "",
    };
}

// 显示提示消息
function showToast(message: string) {
    // 更新Toast消息
    toastMessage.value = message;
    
    // 同时使用全局Toast函数作为备选
    if ($toast) {
        $toast(message);
    }
}
</script>

<template>
    <div>
        <!-- Toast组件 -->
        <Toast :message="toastMessage" />
        
        <main class="flex flex-col items-center min-h-screen friends-page pt-24" :class="{ dispersed: showDisperse }">
            <!-- 我的博客信息 -->
            <div class="my-blog-section">
                <div class="my-blog-card">
                    <!-- 头像和基本信息 -->
                    <div class="blog-header">
                        <div class="avatar-wrapper">
                            <img :src="myFeed.avatar" :alt="myFeed.author" class="blog-avatar">
                            <span class="blog-owner-badge">博主</span>
                        </div>
                        <div class="blog-main-info">
                            <h3 class="blog-name">{{ myFeed.author }}</h3>
                            <p class="blog-subtitle">{{ myFeed.title }}</p>
                        </div>
                    </div>

                    <!-- 博客描述 -->
                    <div class="blog-content">
                        <p class="blog-desc">{{ myFeed.desc }}</p>
                    </div>

                    <!-- 复制按钮 -->
                    <div class="blog-actions">
                        <div class="copy-buttons">
                            <Copy v-for="(code, prompt) in copyFields" :key="prompt" :prompt="prompt" :code="code" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 滚动头像轮播图 -->
            <div class="friends-avatar-carousel">
                <div class="carousel-container">
                    <div class="avatars-wrapper">
                        <div v-for="friend in friends" :key="friend.title" class="avatar-item">
                            <a :href="friend.url" target="_blank" class="avatar-link">
                                <img :src="friend.avatar" :alt="friend.title" class="avatar-image">
                                <div class="avatar-name">{{ friend.title }}</div>
                            </a>
                        </div>
                        <!-- 复制一份实现无缝滚动 -->
                        <div v-for="friend in friends" :key="friend.title + '-duplicate'" class="avatar-item">
                            <a :href="friend.url" target="_blank" class="avatar-link">
                                <img :src="friend.avatar" :alt="friend.title" class="avatar-image">
                                <div class="avatar-name">{{ friend.title }}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <section
                ref="friendsSectionRef"
                class="bg-white rounded-3xl shadow-lg p-12 max-w-4xl w-full mb-12 component-card"
            >
                <h1 class="text-primary text-4xl mb-2 text-center font-fumofumo">{{ pageConfig.title }}</h1>
                <p v-if="'description' in pageConfig" class="text-muted text-xl text-center mb-8">
                    {{ pageConfig.description }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a
                        v-for="friend in displayedFriends"
                        :key="friend.title"
                        :href="friend.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-6 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer no-underline text-inherit hover:shadow-lg flex flex-col md:flex-row gap-2 items-center md:items-start justify-center md:justify-between"
                    >
                        <div class="flex items-center">
                            <img :src="friend.avatar" alt="Friend Avatar" class="w-16 h-16 rounded-full" />
                            <div class="flex flex-col items-start ml-2">
                                <h3 class="text-primary text-xl mb-2 font-fumofumo">{{ friend.title }}</h3>
                                <p class="text-muted text-base leading-relaxed m-0">{{ friend.description }}</p>
                                <div class="mt-3 text-sm text-primary opacity-75">点击前往 -></div>
                            </div>
                        </div>
                    </a>
                </div>
            </section>

            <!-- 分页导航 -->
            <section
                ref="paginationRef"
                v-if="totalPages > 1"
                class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12 component-card"
            >
                <div class="flex justify-center items-center gap-2">
                    <!-- 上一页按钮 -->
                    <NuxtLink
                        v-if="currentPage > 1"
                        :to="`/friends?page=${currentPage - 1}`"
                        class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                    >
                        <i class="fas fa-chevron-left"></i>
                        <span>上一页</span>
                    </NuxtLink>
                    <span
                        v-else
                        class="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                        <i class="fas fa-chevron-left"></i>
                        <span>上一页</span>
                    </span>

                    <!-- 页码显示 -->
                    <div class="flex items-center gap-2 mx-4">
                        <template v-for="pageNum in totalPages" :key="pageNum">
                            <span
                                v-if="pageNum === currentPage"
                                class="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium"
                            >
                                {{ pageNum }}
                            </span>
                            <NuxtLink
                                v-else
                                :to="`/friends?page=${pageNum}`"
                                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                            >
                                {{ pageNum }}
                            </NuxtLink>
                        </template>
                    </div>

                    <!-- 下一页按钮 -->
                    <NuxtLink
                        v-if="currentPage < totalPages"
                        :to="`/friends?page=${currentPage + 1}`"
                        class="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 no-underline"
                    >
                        <span>下一页</span>
                        <i class="fas fa-chevron-right"></i>
                    </NuxtLink>
                    <span
                        v-else
                        class="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                        <span>下一页</span>
                        <i class="fas fa-chevron-right"></i>
                    </span>
                </div>

                <!-- 分页信息 -->
                <div class="text-center mt-4 text-gray-500 text-sm">
                    第 {{ currentPage }} 页，共 {{ totalPages }} 页 · 共 {{ totalItems }} 个网站
                </div>
            </section>

            <!-- 申请友链按钮 -->
            <section
                ref="applyButtonRef"
                class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mb-12 component-card flex justify-center items-center"
            >
                <div class="apply-section">
                    <button
                        class="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-opacity-90 hover:scale-105 no-underline"
                        @click="showApplyForm = true"
                    >
                        申请友链
                    </button>
                </div>
                <!-- 提交成功消息 -->
                <div v-if="showSuccessMessage" class="success-message">
                    <p>提交成功！</p>
                </div>
            </section>

            <!-- 申请友链表单弹窗 -->
            <Teleport to="body">
                <div v-if="showApplyForm" class="modal-overlay" @click="showApplyForm = false">
                    <div class="modal-content apply-form" @click.stop>
                        <h2>申请友链</h2>
                        <form @submit.prevent="submitFriendRequest">
                            <div class="form-group">
                                <label for="siteName">网站名称 *</label>
                                <input
                                    type="text"
                                    id="siteName"
                                    v-model="friendRequest.siteName"
                                    class="styled-input"
                                    placeholder="网站名称"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="siteUrl">网站链接 *</label>
                                <input
                                    type="url"
                                    id="siteUrl"
                                    v-model="friendRequest.siteUrl"
                                    class="styled-input"
                                    placeholder="https://example.com（一定要添加协议头）"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="description">网站描述</label>
                                <textarea
                                    id="description"
                                    v-model="friendRequest.description"
                                    class="styled-textarea"
                                    placeholder="简单介绍一下你的网站"
                                ></textarea>
                            </div>

                            <div class="form-group">
                                <label for="email">联系邮箱 *</label>
                                <input
                                    type="email"
                                    id="email"
                                    v-model="friendRequest.email"
                                    class="styled-input"
                                    placeholder="example@example.com"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label for="avatar">头像链接</label>
                                <input
                                    type="url"
                                    id="avatar"
                                    v-model="friendRequest.avatar"
                                    class="styled-input"
                                    placeholder="https://example.com/avatar.png"
                                />
                            </div>

                            <div class="form-actions">
                                <button type="button" @click="showApplyForm = false" class="styled-button cancel-btn">取消</button>
                                <button type="submit" class="styled-button submit-btn" :disabled="isSubmitting">
                                    {{ isSubmitting ? "提交中..." : "提交申请" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Teleport>


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
                        {{ atBottom ? "再向下滚动进入项目页" : "滚动到底部" }}
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
/* 网站页面特定样式 */
.friends-page .hover\:shadow-lg:hover {
    box-shadow: 0 8px 20px rgba(139, 90, 140, 0.15);
}

.friends-page {
    transition: all 1s ease-out;
}

.component-card {
    transition: all 1s ease-out;
    box-shadow: 0 4px 24px rgba(139, 90, 140, 0.08);
}

/* 分散动画样式 */
.friends-page.dispersed .component-card {
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

/* 申请友链按钮美化样式 */
.styled-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    font-weight: 600;
    letter-spacing: 0.5px;
}

.styled-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.styled-button:active {
    transform: translateY(0);
}

.styled-button.cancel-btn {
    background-color: #f1f5f9;
    color: #64748b;
    box-shadow: 0 2px 8px rgba(100, 116, 139, 0.2);
}

.styled-button.cancel-btn:hover {
    background-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.styled-button.submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.styled-button.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.styled-button.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 申请表单样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.apply-form {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.apply-form h2 {
    margin-top: 0;
    color: #333;
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #444;
}

.styled-input,
.styled-textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.styled-input:focus,
.styled-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.styled-textarea {
    min-height: 100px;
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
}

.styled-button.cancel-btn {
    background-color: #f1f5f9;
    color: #64748b;
}

.styled-button.cancel-btn:hover {
    background-color: #e2e8f0;
}

.styled-button.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

/* 提交成功消息样式 */
.success-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #48bb78;
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    animation: fadeInOut 3s ease-in-out forwards;
}
@keyframes fadeInOut {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

/* 我的博客信息样式 */
.my-blog-section {
    margin-top: 2rem;
    max-width: 896px; /* 与轮播图一致 */
    margin-left: auto;
    margin-right: auto;
    min-height: 180px; /* 设置最小高度，与轮播图容器相近 */
}

.my-blog-card {
    background: var(--ld-bg-card, #f9fafb);
    border: 1px solid var(--c-border, #e5e7eb);
    border-radius: 16px;
    padding: 2.5rem; /* 增加内边距，使内容更大 */
    box-shadow: 0 4px 20px rgba(139, 90, 140, 0.08);
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transform: translateY(0);
    min-height: 180px; /* 确保卡片有足够的高度 */
}

.my-blog-card:hover {
    transform: translateY(-5px);
}

.blog-header {
    display: flex;
    align-items: center;
    gap: 1.5rem; /* 增加间距 */
    margin-bottom: 1.5rem; /* 增加底部边距 */
}

.avatar-wrapper {
    position: relative;
    flex-shrink: 0;
}

.blog-avatar {
    width: 72px; /* 增大头像 */
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid var(--c-border, #e5e7eb); /* 加粗边框 */
    transition: transform 0.3s ease;
}

.blog-avatar:hover {
    transform: scale(1.05);
}

.blog-owner-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--c-primary, #8b5a8c);
    color: white;
    padding: 4px 10px; /* 增加徽章大小 */
    border-radius: 8px;
    font-size: 0.7rem; /* 增大字体 */
    font-weight: 600;
    z-index: 5;
    animation: pulse 2s infinite;
}

.blog-main-info {
    flex: 1;
}

.blog-name {
    font-size: 1.6rem; /* 增大字体 */
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--c-text, #333);
}

.blog-subtitle {
    font-size: 1.1rem; /* 增大字体 */
    color: var(--c-text-2, #666);
    margin: 0;
    font-weight: 500;
}

.blog-content {
    margin-bottom: 1.5rem; /* 增加底部边距 */
    flex: 1;
}

.blog-desc {
    font-size: 1.05rem; /* 增大字体 */
    line-height: 1.6;
    color: var(--c-text, #333);
    margin: 0;
    padding: 1rem; /* 增加内边距 */
    background: rgba(139, 90, 140, 0.06);
    border-radius: 10px;
    border-left: 3px solid var(--c-primary, #8b5a8c);
}

.blog-actions {
    margin-top: 2rem; /* 增加顶部边距 */
}

.copy-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem; /* 增加按钮间距 */
    justify-content: flex-start;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(139, 90, 140, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(139, 90, 140, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(139, 90, 140, 0);
    }
}

/* 滚动头像轮播图样式 */
.friends-avatar-carousel {
    margin: 2rem 0;
    max-width: 896px; /* 与max-w-4xl一致 */
    margin-left: auto;
    margin-right: auto;
}

.carousel-container {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: var(--ld-bg-card, #f9fafb);
    border: 1px solid var(--c-border, #e5e7eb);
    box-shadow: 0 4px 20px rgba(139, 90, 140, 0.08);
    padding: 1rem;
}

.avatars-wrapper {
    display: flex;
    animation: scroll-left 30s linear infinite;
}

.avatar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1rem;
    min-width: 100px;
    transition: transform 0.3s ease;
}

.avatar-item:hover {
    transform: translateY(-5px);
}

.avatar-link {
    text-decoration: none;
}

.avatar-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--c-primary, #8b5a8c);
    margin-bottom: 0.5rem;
    transition: transform 0.3s ease;
}

.avatar-image:hover {
    transform: scale(1.1);
}

.avatar-name {
    font-size: 0.85rem;
    color: var(--c-text, #333);
    text-align: center;
    font-weight: 500;
}

@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

/* 暂停动画当鼠标悬停在轮播图上 */
.carousel-container:hover .avatars-wrapper {
    animation-play-state: paused;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .apply-form {
        padding: 1.5rem;
        width: 95%;
    }

    .form-actions {
        flex-direction: column;
    }

    .styled-button {
        width: 100%;
        padding: 1rem;
    }
    
    .avatar-item {
        min-width: 80px;
        margin: 0 0.5rem;
    }
    
    .avatar-item img {
        width: 50px;
        height: 50px;
    }
    
    .avatar-item div {
        font-size: 0.75rem;
    }
    
    /* 博客信息卡片移动端适配 */
    .my-blog-section {
        aspect-ratio: unset; /* 移动端不使用固定比例 */
        margin: 1rem;
        min-height: auto; /* 移动端不使用最小高度 */
    }
    
    .my-blog-card {
        padding: 1.5rem;
        min-height: auto;
    }
    
    .blog-header {
        margin-bottom: 1rem;
        gap: 1rem;
    }
    
    .blog-avatar {
        width: 56px;
        height: 56px;
    }
    
    .blog-name {
        font-size: 1.3rem;
    }
    
    .blog-subtitle {
        font-size: 1rem;
    }
    
    .blog-desc {
        font-size: 0.9rem;
        padding: 0.8rem;
    }
    
    .copy-buttons {
        gap: 0.6rem;
    }
}
</style>
