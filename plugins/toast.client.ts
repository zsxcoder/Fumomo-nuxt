// 全局Toast插件
export default defineNuxtPlugin((nuxtApp) => {
  // 创建全局Toast函数
  const showToast = (message: string) => {
    // 确保在客户端执行
    if (import.meta.client) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'var(--c-primary, #8b5a8c)';
      toast.style.color = 'white';
      toast.style.padding = '0.8rem 1.5rem';
      toast.style.borderRadius = '8px';
      toast.style.zIndex = '1000';
      toast.style.fontSize = '0.9rem';
      toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';

      document.body.appendChild(toast);

      // 淡入效果
      setTimeout(() => {
        toast.style.opacity = '1';
      }, 10);

      // 3秒后自动移除
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 3000);
    }
  };

  // 将Toast函数添加到全局属性中
  nuxtApp.provide('toast', showToast);
  
  // 为了兼容现有代码，也将Toast函数添加到window对象
  if (import.meta.client) {
    (window as any).$toast = showToast;
  }
});