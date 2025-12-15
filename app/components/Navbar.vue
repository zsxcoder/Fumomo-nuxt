<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { siteConfig, type NavigationItem } from '../config/index'

// 导航菜单项类型定义，使用从配置文件中导入的类型
type MenuItem = NavigationItem

interface Props {
  currentPage?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: ''
})

const isMenuOpen = ref(false)
const route = useRoute()
const openDropdowns = ref<Set<string>>(new Set())

// 获取导航菜单配置，现在直接从配置文件中读取子菜单
const navigationWithChildren = computed<MenuItem[]>(() => {
  // 直接返回配置中的导航菜单，已经包含了子菜单结构
  return siteConfig.navigation
})

const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
  openDropdowns.value.clear()
}

// 切换下拉菜单
const toggleDropdown = (key: string, event?: Event, isMobileMenu = false) => {
  if (event) {
    event.preventDefault()
  }
  
  // 如果是移动端菜单，不要关闭其他菜单
  if (isMobileMenu) {
    if (openDropdowns.value.has(key)) {
      openDropdowns.value.delete(key)
    } else {
      openDropdowns.value.add(key)
    }
  } else {
    // 桌面端菜单，关闭其他菜单
    if (openDropdowns.value.has(key)) {
      openDropdowns.value.delete(key)
    } else {
      openDropdowns.value.clear()
      openDropdowns.value.add(key)
    }
  }
}

// 关闭指定的下拉菜单
const closeDropdown = (key: string) => {
  openDropdowns.value.delete(key)
}

// 关闭所有下拉菜单
const closeAllDropdowns = () => {
  openDropdowns.value.clear()
}

// 判断菜单项是否为当前页面
const isCurrentPage = (item: MenuItem) => {
  return props.currentPage === item.key || 
         (item.children && item.children.some(child => props.currentPage === child.key))
}

// 计算下拉菜单位置，确保在视口内
const getDropdownPosition = (key: string) => {
  if (import.meta.server) return { left: '50%', transform: 'translateX(-50%)' }
  
  const dropdownWidth = 192 // w-48 = 12rem = 192px
  const viewportWidth = window.innerWidth
  
  // 默认居中定位
  let left = '50%'
  let transform = 'translateX(-50%)'
  
  // 如果屏幕较小，调整定位策略
  if (viewportWidth < 768) {
    // 移动端右侧对齐
    left = 'auto'
    transform = 'none'
    return { right: '1rem', left, transform }
  } else if (viewportWidth < 1024) {
    // 平板端稍微右移
    left = '60%'
  }
  
  return { left, transform }
}

// 检测是否为移动设备
const isMobileDevice = () => {
  if (import.meta.server) return false
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 监听路由变化关闭菜单
watch(() => route.path, () => {
  closeMenu()
})

// 监听窗口大小变化，关闭所有下拉菜单
const handleResize = () => {
  closeAllDropdowns()
}

let clickOutsideHandler: ((e: Event) => void) | null = null
let escapeHandler: ((e: KeyboardEvent) => void) | null = null
let resizeHandler: ((e: Event) => void) | null = null

onMounted(() => {
  // 监听点击外部区域关闭菜单
  clickOutsideHandler = (e: Event) => {
    const target = e.target as HTMLElement
    if (!target.closest('#nav-toggle') && !target.closest('#nav-menu') && !target.closest('.mobile-menu-container')) {
      closeMenu()
    }
  }
  
  document.addEventListener('click', clickOutsideHandler)
  
  // 监听 ESC 键关闭菜单
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
    }
  }
  
  document.addEventListener('keydown', escapeHandler)
  
  // 监听窗口大小变化
  resizeHandler = handleResize
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (clickOutsideHandler) {
    document.removeEventListener('click', clickOutsideHandler)
  }
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler)
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<template>
  <div>
    <!-- 导航栏 -->
    <nav id="navbar" class="fixed top-0 left-0 w-full backdrop-blur-md border-b z-50 py-2 transition-opacity duration-700 ease-in bg-white/90 border-primary/10">
      <div class="max-w-screen-xl mx-auto px-8 flex justify-between items-center">
        <NuxtLink to="/" class="text-3xl font-bold font-fumofumo transition-all duration-300 hover:text-pink-400 hover:scale-105 text-primary">
          {{ siteConfig.site.title }}
        </NuxtLink>

        <!-- 汉堡菜单按钮 (移动端) -->
        <button 
          class="md:hidden flex flex-col bg-transparent border-none cursor-pointer p-3 relative z-50 w-10 h-10 justify-center items-center" 
          id="nav-toggle"
          :class="{ 'nav-toggle-active': isMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="切换菜单"
        >
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
          <span class="w-6 h-0.5 my-0.5 rounded transition-all duration-300 bg-primary"></span>
        </button>

        <!-- 桌面端菜单 -->
        <ul class="hidden md:flex list-none m-0 p-0 gap-6 items-center" id="nav-menu">
          <template v-for="item in navigationWithChildren.slice(1)" :key="item.key">
            <li 
              v-if="!item.children"
              class="relative"
            >
              <NuxtLink 
                :to="item.href" 
                class="no-underline font-medium transition-all duration-300 relative py-2 px-4 rounded-full nav-link hover:-translate-y-0.5 flex items-center"
                :class="currentPage === item.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
            
              <!-- 带有子菜单的菜单项 -->
            <li 
              v-else
              class="relative group"
              @mouseenter="!isMobileDevice() && toggleDropdown(item.key)"
              @mouseleave="!isMobileDevice() && closeDropdown(item.key)"
            >
              <div class="flex items-center gap-2">
                <!-- 菜单文字链接 -->
                <NuxtLink 
                  :to="item.href" 
                  class="no-underline font-medium transition-all duration-300 relative py-2 px-3 rounded-full nav-link hover:-translate-y-0.5"
                  :class="isCurrentPage(item) ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
                >
                  {{ item.name }}
                </NuxtLink>
                <!-- 下拉箭头按钮 -->
                <button
                  class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary/10 transition-colors"
                  @click="toggleDropdown(item.key, $event)"
                  :aria-expanded="openDropdowns.has(item.key)"
                  :aria-haspopup="true"
                  :aria-controls="`${item.key}-dropdown`"
                >
                  <i class="fas fa-chevron-down text-xs transition-transform duration-200" 
                     :class="openDropdowns.has(item.key) ? 'rotate-180' : ''"></i>
                </button>
              </div>
              
              <!-- 子菜单下拉框 -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 scale-95 -translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 -translate-y-2"
              >
                <div 
                  v-show="openDropdowns.has(item.key) || false"
                  class="absolute top-full mt-2 w-48 bg-white/95 backdrop-blur-md shadow-lg border border-primary/10 rounded-xl z-50 overflow-hidden dropdown-menu"
                  :id="`${item.key}-dropdown`"
                  :style="getDropdownPosition(item.key)"
                >
                  <ul class="list-none m-0 p-2">
                    <li v-for="child in item.children" :key="child.key" class="w-full">
                      <NuxtLink 
                        :to="child.href" 
                        class="no-underline font-medium transition-all duration-200 relative py-2.5 px-4 rounded-lg block hover:bg-primary/10 text-sm text-center"
                        :class="currentPage === child.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
                        @click="closeMenu"
                      >
                        {{ child.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </Transition>
            </li>
          </template>
          
          <!-- 桌面端主题切换 -->
          <li class="relative">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>

    <!-- 移动端菜单遮罩 -->
    <div 
      v-if="isMenuOpen"
      class="fixed inset-0 bg-black/20 z-30 md:hidden transition-opacity duration-300"
      @click="closeMenu"
    ></div>

    <!-- 移动端菜单 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div 
        v-if="isMenuOpen"
        class="mobile-menu-container fixed top-16 right-4 w-56 bg-white/95 backdrop-blur-md shadow-lg border border-primary/10 rounded-xl z-50 py-3 px-3 md:hidden max-h-[calc(100vh-88px)] overflow-y-auto"
      >
        <!-- 移动端主题切换 -->
        <div class="flex justify-center py-2 mb-2 border-b border-primary/10">
          <ThemeToggle />
        </div>
        
        <ul class="list-none m-0 p-0 flex flex-col gap-1">
          <template v-for="item in navigationWithChildren.slice(1)" :key="item.key">
            <!-- 无子菜单项 -->
            <li v-if="!item.children" class="w-full">
              <NuxtLink 
                :to="item.href" 
                class="no-underline font-medium transition-all duration-300 relative py-2.5 px-3 rounded-lg block hover:bg-primary/10 text-center text-sm"
                :class="currentPage === item.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
                @click="closeMenu"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
            
            <!-- 带有子菜单的菜单项 -->
            <li v-else class="w-full">
              <div class="flex items-center justify-between px-3 py-2.5">
                <!-- 菜单文字链接 -->
                <NuxtLink 
                  :to="item.href" 
                  class="no-underline font-medium transition-all duration-300 text-sm hover:bg-primary/10 rounded-lg px-2 py-2 flex-1 text-center"
                  :class="isCurrentPage(item) ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
                  @click="closeMenu"
                >
                  {{ item.name }}
                </NuxtLink>
                <!-- 下拉箭头按钮 -->
                <button
                  class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-primary/10 transition-colors"
                  @click.stop="toggleDropdown(item.key, $event, true)"
                  :aria-expanded="openDropdowns.has(item.key)"
                  :aria-haspopup="true"
                  :aria-controls="`${item.key}-mobile-dropdown`"
                >
                  <i class="fas fa-chevron-down text-xs transition-transform duration-200" 
                     :class="openDropdowns.has(item.key) ? 'rotate-180' : ''"></i>
                </button>
              </div>
              
              <!-- 移动端子菜单 -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 -translate-y-2 max-h-0"
                enter-to-class="opacity-100 translate-y-0 max-h-96"
                leave-from-class="opacity-100 translate-y-0 max-h-96"
                leave-to-class="opacity-0 -translate-y-2 max-h-0"
              >
                <ul 
                  v-show="openDropdowns.has(item.key) || false"
                  class="list-none m-0 p-0 pl-2 pr-1 flex flex-col gap-1 mt-1 overflow-hidden"
                  :id="`${item.key}-mobile-dropdown`"
                >
                  <li v-for="child in item.children" :key="child.key" class="w-full">
                    <NuxtLink 
                      :to="child.href" 
                      class="no-underline font-medium transition-all duration-200 relative py-2 px-3 rounded-lg block hover:bg-primary/10 text-sm text-center"
                      :class="currentPage === child.key ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary'"
                      @click="closeMenu"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style>
/* 汉堡菜单动画效果 */
#nav-toggle {
  transition: all 0.3s ease;
}

#nav-toggle:hover {
  background-color: rgba(139, 90, 140, 0.1);
  border-radius: 6px;
}

.nav-toggle-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.nav-toggle-active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 导航链接hover效果 */
.nav-link:hover {
  color: #8b5a8c !important;
}

/* 下拉菜单样式 - 适配博客风格 */
.group:hover .group-hover\:block {
  display: block;
}

/* 下拉菜单深色模式适配 */
.dark .dropdown-menu {
  background-color: rgba(31, 41, 55, 0.95);
  border-color: rgba(139, 90, 140, 0.3);
}

.dark #nav-menu ul li::before {
  background: linear-gradient(90deg, rgba(139, 90, 140, 0.1) 0%, rgba(55, 65, 81, 0.3) 100%);
}

.dark #nav-menu ul li:hover::before {
  width: 100%;
}

/* 移动端菜单项样式 */
@media (max-width: 768px) {
  .mobile-menu .nav-link {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 16px;
    border-radius: 8px;
    margin: 2px 0;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 14px;
  }
  
  .mobile-menu .nav-link:hover {
    background-color: rgba(139, 90, 140, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 90, 140, 0.1);
  }
  
  .mobile-menu .nav-link.router-link-active {
    background-color: rgba(139, 90, 140, 0.15);
    color: #8b5a8c;
  }
  
  /* 优化移动端菜单滚动 */
  .max-h-\[calc\(100vh-88px\)\] {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 90, 140, 0.3) transparent;
  }
  
  .max-h-\[calc\(100vh-88px\)\]::-webkit-scrollbar {
    width: 4px;
  }
  
  .max-h-\[calc\(100vh-88px\)\]::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .max-h-\[calc\(100vh-88px\)\]::-webkit-scrollbar-thumb {
    background-color: rgba(139, 90, 140, 0.3);
    border-radius: 4px;
  }
}

/* 多级菜单适配博客样式 */
#nav-menu .group .nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #8b5a8c;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

#nav-menu .group:hover .nav-link::after {
  width: 80%;
}

/* 子菜单项动画效果 */
#nav-menu ul li {
  position: relative;
  transition: all 0.2s ease;
}

#nav-menu ul li::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(139, 90, 140, 0.05) 0%, rgba(255, 238, 248, 0.2) 100%);
  transition: width 0.3s ease;
  border-radius: 8px;
  z-index: -1;
}

#nav-menu ul li:hover::before {
  width: 100%;
}

/* 子菜单焦点样式 */
#nav-menu button:focus-visible {
  outline: 2px solid rgba(139, 90, 140, 0.5);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 确保下拉菜单在移动端可访问 */
@media (max-width: 768px) {
  [aria-expanded="true"] + div {
    display: block !important;
  }
}

/* 添加过渡效果，使下拉菜单平滑出现 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .dropdown-menu {
    left: 60% !important;
    transform: translateX(-60%) !important;
  }
}

@media (max-width: 768px) {
  .dropdown-menu {
    right: 1rem !important;
    left: auto !important;
    transform: none !important;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .group:hover .nav-link::after {
    width: 0; /* 在触摸设备上不显示下划线 */
  }
  
  /* 增大触摸目标 */
  #nav-menu button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* 确保桌面端菜单项对齐 */
#nav-menu li {
  display: flex;
  align-items: center;
}

#nav-menu .nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

/* 调整多级菜单间距 */
#nav-menu .group div {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

#nav-menu .group .nav-link {
  padding-right: 0.25rem;
}

#nav-menu .group button {
  margin-left: 0.125rem;
}

/* 确保移动端菜单项对齐 */
@media (max-width: 768px) {
  #nav-menu li {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 调整移动端多级菜单间距 */
  .mobile-menu-container .flex.items-center.justify-between {
    gap: 0.25rem;
  }
}

/* 移动端菜单深色模式适配 */
.dark .mobile-menu-container {
  background-color: rgba(31, 41, 55, 0.95);
  border-color: rgba(139, 90, 140, 0.3);
}

.dark .mobile-menu-container .border-b {
  border-color: rgba(139, 90, 140, 0.2) !important;
}

/* 移动端子菜单深色模式 */
.dark .mobile-menu-container ul li a {
  color: #d1d5db;
}

.dark .mobile-menu-container ul li a:hover {
  background-color: rgba(139, 90, 140, 0.2);
  color: #a974a9;
}

.dark .mobile-menu-container ul li a.bg-primary\/10 {
  background-color: rgba(139, 90, 140, 0.2) !important;
  color: #a974a9 !important;
}
</style>
