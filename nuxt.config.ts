// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 配置CSS
  css: [
    '@/assets/styles/global.css',
    '@/assets/styles/dark.css',
    '@/assets/styles/giscus.css'
  ],
  
  // 配置modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  // 颜色模式配置
  colorMode: {
    preference: 'system', // 默认跟随系统
    fallbackValue: 'light', // 系统不支持时使用亮色模式
    dataValue: 'theme', // 存储在 data-theme 属性中
    classSuffix: '', // 不使用后缀
    storageKey: 'color-mode', // 本地存储键名
  },

  // 运行时配置
  runtimeConfig: {
    // 服务端私有配置
    rssUrl: process.env.RSS_URL || 'https://blog.zsxcoder.top/atom.xml',
    
    // 公开的运行时配置
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://haku.sakura.ink'
    }
  },

  // 构建配置，为生产环境优化
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['fast-xml-parser'] : []
  }
})
