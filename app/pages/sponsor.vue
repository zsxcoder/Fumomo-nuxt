<template>
  <div class="sponsor-container">
        <div class="sponsor-card">
          <div class="header">
            <div class="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#8b5a8c"/>
              </svg>
            </div>
            <h1 class="title">赞助支持</h1>
            <p class="subtitle">您的每一份支持都是我们前进的动力，让我们共同创造更多可能 ✨。</p>
          </div>

          <div class="qr-codes">
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[0] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 0)"
              @mouseleave="() => handleQrCardMouseLeave(0)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[0]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[0]?.x - 80 + 'px',
                  top: qrCardEffects[0]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(7, 193, 96, 0.6) 0%, rgba(7, 193, 96, 0.3) 30%, rgba(7, 193, 96, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(7, 193, 96, 0.5), 0 0 160px rgba(7, 193, 96, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#07c160">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.162 4.203 2.97 5.498L2.098 17.5l2.647-1.363c.893.219 1.852.328 2.946.328.32 0 .631-.017.938-.049-.197-.683-.308-1.398-.308-2.141 0-4.054 3.891-7.342 8.691-7.342.041 0 .082.001.123.002C16.94 4.564 13.531 2.188 8.691 2.188zm-2.262 5.5a.877.877 0 1 1 0-1.754.877.877 0 0 1 0 1.754zm4.524 0a.877.877 0 1 1 0-1.754.877.877 0 0 1 0 1.754z"/>
                  <path d="M15.785 9.006c-3.92 0-7.09 2.693-7.09 6.021 0 .858.253 1.664.693 2.35L8.523 19.5l1.849-.652c.693.131 1.415.197 2.159.197 3.92 0 7.09-2.693 7.09-6.021s-3.17-6.018-7.09-6.018zm-2.262 4.524a.877.877 0 1 1 0-1.754.877.877 0 0 1 0 1.754zm4.524 0a.877.877 0 1 1 0-1.754.877.877 0 0 1 0 1.754z"/>
                </svg>
              </div>
              <h3>微信支付</h3>
              <div class="qr-placeholder">
                <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/weixin.webp" alt="微信二维码">
              </div>
              <p class="qr-description">扫一扫，请我喝杯咖啡</p>
            </div>
            
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[1] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 1)"
              @mouseleave="() => handleQrCardMouseLeave(1)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[1]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[1]?.x - 80 + 'px',
                  top: qrCardEffects[1]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(22, 119, 255, 0.6) 0%, rgba(22, 119, 255, 0.3) 30%, rgba(22, 119, 255, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(22, 119, 255, 0.5), 0 0 160px rgba(22, 119, 255, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#1677ff">
                  <path d="M22.6 14.3c-1.1.4-2.4.6-3.8.6-3.3 0-6.2-1.4-8.3-3.7-1.1 2.2-2.8 4.1-4.9 5.4 1.5 1.1 3.4 1.8 5.5 1.8 2.8 0 5.3-1.2 7.1-3.1.9.5 1.9.8 2.9.8 1.4 0 2.7-.4 3.8-1.1-.7-.2-1.4-.4-2.3-.7zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.5 13.2c-.8.5-1.7.8-2.7.8-.9 0-1.7-.2-2.4-.6 1.8-1.2 3.2-2.8 4.1-4.7 1.2.8 2.2 1.9 2.8 3.2-.6.4-1.2.8-1.8 1.3zm-7.8-2.9c1.8 2 4.3 3.2 7.1 3.2 1.2 0 2.3-.2 3.3-.5-.5-1.1-1.3-2-2.3-2.7-.8 1.7-2 3.1-3.5 4.1-1.8-.9-3.3-2.3-4.3-4.1h-.3z"/>
                </svg>
              </div>
              <h3>支付宝</h3>
              <div class="qr-placeholder">
                <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/alipay.webp" alt="支付宝二维码">
              </div>
              <p class="qr-description">扫一扫，请我喝杯咖啡</p>
            </div>
            
            <div 
              class="qr-card"
              :ref="el => qrCardRefs[2] = el as HTMLElement"
              @mousemove="(event) => handleQrCardMouseMove(event, 2)"
              @mouseleave="() => handleQrCardMouseLeave(2)"
            >
              <!-- 鼠标跟随效果 -->
              <div 
                v-if="qrCardEffects[2]?.show"
                class="absolute w-40 h-40 rounded-full blur-2xl transition-all duration-75 ease-out pointer-events-none z-0"
                :style="{
                  left: qrCardEffects[2]?.x - 80 + 'px',
                  top: qrCardEffects[2]?.y - 80 + 'px',
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.3) 30%, rgba(236, 72, 153, 0.15) 60%, transparent 90%)',
                  boxShadow: '0 0 80px rgba(236, 72, 153, 0.5), 0 0 160px rgba(236, 72, 153, 0.3)'
                }"
              ></div>
              <div class="qr-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#ec4899">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3>爱发电支持</h3>
              <div class="qr-placeholder">
                <img src="https://cdn.fis.ink/img/2025/02/11/67aad655d87f6.png" alt="爱发电二维码">
              </div>
              <p class="qr-description">在爱发电上支持我</p>
              <div class="qr-actions">
                <a href="https://afdian.com/a/zsxcoder" class="afdian-link" target="_blank">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <path d="M15 3h6v6"/>
                    <path d="M10 14L21 3"/>
                  </svg>
                  前往爱发电
                </a>
              </div>
            </div>
          </div>
          
          <div class="notice">
            <div class="notice-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <p class="notice-text">
              <strong>重要提示：</strong>赞助了一定要给 <a href="mailto:me@mcyzsx.top" class="email">me@mcyzsx.top</a>发邮件，表明渠道和单号，和你自己名称和内容，否则我认不清可能加不上。
            </p>
          </div>
          
          <div class="sponsors-table">
            <h2>赞助名单</h2>
            <table>
              <thead>
                <tr>
                  <th>赞助者</th>
                  <th>日期</th>
                  <th>寄语</th>
                  <th>金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sponsor, index) in sponsors" :key="index">
                  <td>{{ sponsor.name }}</td>
                  <td>{{ sponsor.date }}</td>
                  <td>{{ sponsor.message }}</td>
                  <td>{{ sponsor.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { siteConfig, getPageConfig } from '~/config'
import sponsorsData from '@/data/sponsors.json'

// 页面配置
const pageConfig = getPageConfig('sponsor')

// 设置页面元数据
definePageMeta({
  title: pageConfig.title
})

useHead({
  title: `${pageConfig.title} - ${siteConfig.site.title}`,
  meta: [
    { name: 'description', content: pageConfig.description }
  ]
})

const sponsors = ref(sponsorsData)

const qrCardRefs = ref<HTMLElement[]>([])
const qrCardEffects = reactive<Record<number, { x: number; y: number; show: boolean }>>({})

const handleQrCardMouseMove = (event: MouseEvent, index: number) => {
  const card = qrCardRefs.value[index]
  if (!card) return
  
  const rect = card.getBoundingClientRect()
  qrCardEffects[index] = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    show: true
  }
}

const handleQrCardMouseLeave = (index: number) => {
  if (qrCardEffects[index]) {
    qrCardEffects[index].show = false
  }
}
</script>

<style scoped>
.sponsor-container {
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
  padding: 60px 16px 80px 16px;
}

@media (min-width: 640px) {
  .sponsor-container {
    padding: 80px 24px 80px 24px;
  }
}

@media (min-width: 1024px) {
  .sponsor-container {
    padding: 80px 32px 80px 32px;
  }
}

.sponsor-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.dark .sponsor-card {
  background: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.header {
  margin-bottom: 48px;
}

.icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.dark .title {
  color: rgba(255, 255, 255, 0.95);
}

.subtitle {
  font-size: 18px;
  color: #6b7280;
  font-weight: 400;
}

.dark .subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.qr-codes {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin: 32px 0;
}

@media (max-width: 768px) {
  .qr-codes {
    flex-direction: column;
    align-items: center;
  }
}

.qr-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.dark .qr-card {
  background: #1f2937;
  border: 1px solid #374151;
}

.qr-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.qr-card h3 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 24px 0;
}

.dark .qr-card h3 {
  color: white;
}

.qr-placeholder {
  width: 160px;
  height: 160px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.dark .qr-placeholder {
  background: #374151;
  border: 1px solid #4b5563;
}

.qr-placeholder img {
  width: 140px;
  height: 140px;
  border-radius: 8px;
}

.qr-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.dark .qr-description {
  color: rgba(255, 255, 255, 0.7);
}

.afdian-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  color: #374151;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
}

.dark .afdian-link {
  background: #374151;
  color: #f9fafb;
  border: 1px solid #4b5563;
}

.afdian-link:hover {
  background: #f3f4f6;
}

.dark .afdian-link:hover {
  background: #4b5563;
}

.notice {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  margin-top: 24px;
  text-align: center;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dark .notice {
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
}

.notice-text {
  color: #1e40af;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  flex: 1;
  text-align: left;
}

.dark .notice-text {
  color: #cbd5e1;
}

.notice-text strong {
  color: #dc2626;
  font-weight: 600;
}

.dark .notice-text strong {
  color: #f87171;
}

.email {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: monospace;
}

.dark .email {
  color: #93c5fd;
  background: #334155;
}

.email:hover {
  background: #e2e8f0;
}

.dark .email:hover {
  background: #475569;
}

.sponsors-table {
  margin-top: 48px;
}

.sponsors-table h2 {
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.dark .sponsors-table h2 {
  color: white;
}

.sponsors-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dark .sponsors-table table {
  background: #111827;
  border: 1px solid #374151;
}

.sponsors-table th,
.sponsors-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.dark .sponsors-table th,
.dark .sponsors-table td {
  border-bottom: 1px solid #374151;
}

.sponsors-table th {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.025em;
}

.dark .sponsors-table th {
  background: #1f2937;
  color: #f3f4f6;
}

.sponsors-table td {
  color: #6b7280;
  font-size: 14px;
}

.dark .sponsors-table td {
  color: #d1d5db;
}

.sponsors-table tbody tr:hover {
  background: #f9fafb;
}

.dark .sponsors-table tbody tr:hover {
  background: #1f2937;
}

.sponsors-table tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .sponsor-container {
    padding: 40px 16px 60px 16px;
  }
  
  .sponsor-card {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .qr-codes {
    flex-direction: column;
    align-items: center;
  }
  
  .sponsors-table {
    overflow-x: auto;
  }
  
  .sponsors-table table {
    min-width: 500px;
  }
  
  .qr-card {
    padding: 24px 20px;
  }
  
  .qr-card img {
    width: 160px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .sponsor-container {
    padding: 24px 12px 40px 12px;
  }
  
  .sponsor-card {
    padding: 24px 20px;
  }
  
  .header {
    margin-bottom: 32px;
  }
  
  .notice {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }
}
</style>