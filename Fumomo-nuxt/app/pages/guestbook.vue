<!-- ... existing code ... -->
<style scoped>
/* 深色模式适配 */
.dark .giscus-container {
    background: rgba(31, 41, 55, 0.8) !important; /* 深色模式下的背景 */
    border-color: rgba(139, 90, 140, 0.2) !important; /* 深色模式下的边框颜色 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important; /* 深色模式下的阴影效果 */
}

/* 确保Giscus组件容器内的元素也能正确响应主题变化 */
.giscus-container :deep(.giscus-container) {
    background: transparent !important;
    transition: background-color 0.3s ease;
}

.dark .giscus-container :deep(.giscus-container) {
    background: transparent !important;
}

/* 深色模式下评论按钮样式 */
.dark .comment-section button {
    background-color: #c291cc;
    color: #ffffff;
}

/* 深色模式下评论输入框样式 */
.dark .comment-section textarea {
    background-color: rgba(31, 41, 55, 0.8);
    color: #d1d5db;
    border-color: rgba(139, 90, 140, 0.2);
}

/* 深色模式下回复按钮样式 */
.dark .reply-button {
    background-color: #c291cc;
    color: #ffffff;
}

/* 深色模式下回复输入框样式 */
.dark .reply-input {
    background-color: rgba(31, 41, 55, 0.8);
    color: #d1d5db;
    border-color: rgba(139, 90, 140, 0.2);
}
</style>
<!-- ... existing code ... -->