/* ============================================================
   main.js - 初始化入口（ES Module 入口）
   type="module" 脚本默认 defer，执行时 DOM 已解析完毕
   ============================================================ */

import { loadCategories } from './data.js';
import { setupRouter } from './router.js';
import { bindEvents } from './events.js';

// ========== Header 滚动效果 ==========
function setupHeaderScroll() {
    const scroller = document.querySelector('.main');
    scroller.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('scrolled', scroller.scrollTop > 10);
    });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    setupHeaderScroll();
    setupRouter();
    bindEvents();
});
