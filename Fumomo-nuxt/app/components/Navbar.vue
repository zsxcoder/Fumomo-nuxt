<!-- ... existing code ... -->
<style>
/* 深色模式适配 */
.dark #navbar {
    background-color: rgba(31, 41, 55, 0.95);
    border-color: rgba(139, 90, 140, 0.2);
}

.dark .nav-link:hover {
    color: #c291cc !important;
}

.dark .mobile-menu-container {
    background-color: rgba(31, 41, 55, 0.95);
    border-color: rgba(139, 90, 140, 0.2);
}

.dark .mobile-menu-container .nav-link:hover {
    background-color: rgba(139, 90, 140, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 90, 140, 0.1);
}

.dark .mobile-menu-container .nav-link.router-link-active {
    background-color: rgba(139, 90, 140, 0.15);
    color: #c291cc;
}

/* 深色模式下图标颜色 */
.dark .fas {
    color: #d1d5db;
}

/* 深色模式下按钮颜色 */
.dark .theme-toggle-button {
    background-color: #c291cc;
    color: #ffffff;
}
</style>
<!-- ... existing code ... -->