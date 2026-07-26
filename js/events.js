/* ============================================================
   events.js - 事件绑定（事件委托）
   统一管理所有交互：站内 .md 链接拦截、data-action、分类标签、文章卡片、搜索
   元素会动态重渲染，故统一使用 document 上的事件委托
   ============================================================ */

import { selectCategoryById } from './render.js';
import { navigateToPost } from './router.js';
import { goHome, goBack } from './article.js';
import { filterPosts } from './render.js';

export function bindEvents() {
    // 全局点击委托
    document.addEventListener('click', (e) => {
        // 1) 站内 .md 链接拦截：改为 SPA 内渲染而非直接跳走
        const a = e.target.closest('a');
        if (a) {
            const href = a.getAttribute('href') || '';
            if (/\.md($|[?#])/i.test(href) && !/^(https?:|mailto:|tel:)/i.test(href)) {
                e.preventDefault();
                let file = href.split('#')[0].split('?')[0];
                if (file.startsWith('/')) file = file.slice(1); // 统一为相对站点根的路径
                navigateToPost(file);
                return;
            }
        }

        // 2) 具名操作（首页 / 返回）
        const actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            const action = actionEl.dataset.action;
            if (action === 'home') { e.preventDefault(); goHome(); }
            else if (action === 'back') { goBack(); }
            return;
        }

        // 3) 分类标签（动态渲染）
        const tab = e.target.closest('.category-tab');
        if (tab) { selectCategoryById(tab.dataset.id); return; }

        // 4) 文章卡片（动态渲染）
        const card = e.target.closest('.post-card');
        if (card) { navigateToPost(card.dataset.file); return; }
    });

    // 搜索框输入
    const search = document.getElementById('searchInput');
    if (search) search.addEventListener('input', filterPosts);
}
