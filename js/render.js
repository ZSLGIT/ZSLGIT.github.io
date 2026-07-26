/* ============================================================
   render.js - 列表渲染与分类标签
   ============================================================ */

import { state } from './state.js';
import { ALL_CATEGORY } from './config.js';
import { escapeHtml } from './utils.js';
import { showListView } from './article.js';
import { navigateToPost } from './router.js';

// ========== 渲染分类标签栏 ==========
export function renderCategoryTabs() {
    const wrap = document.getElementById('categoryTabs');
    wrap.innerHTML = state.displayCategories.map(c =>
        `<button class="category-tab" data-id="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`
    ).join('');
    highlightActiveTab();
}

function highlightActiveTab() {
    document.querySelectorAll('.category-tab').forEach(b => {
        b.classList.toggle('active', state.currentCategory && b.dataset.id === state.currentCategory.id);
    });
}

// 通过 id 选择分类（由标签点击触发）
export function selectCategoryById(id) {
    const cat = state.displayCategories.find(c => c.id === id);
    if (!cat) return;
    const target = '#/cat/' + encodeURIComponent(cat.id);
    selectCategory(cat);                        // 立即渲染，确保点击必响应
    if (location.hash !== target) location.hash = target; // 同步 URL（hashchange 会幂等再渲染一次，无副作用）
}

// ========== 选择分类并渲染文章 ==========
export function selectCategory(cat) {
    state.currentCategory = cat;
    highlightActiveTab();
    document.getElementById('sectionTitle').textContent = cat.name || '文章';
    document.getElementById('searchInput').value = '';
    showListView();

    // “全部”直接使用聚合结果；其它分类读取已预加载的列表
    state.allPosts = (cat.id === 'all') ? state.aggregatedPosts : (state.categoryPostsMap[cat.id] || []);
    renderPosts(state.allPosts);
}

export function renderPosts(posts) {
    const grid = document.getElementById('pageGrid') || document.getElementById('postGrid');
    if (!posts.length) {
        grid.innerHTML = `<div class="empty-state"><p>没有找到匹配的文章</p></div>`;
        return;
    }
    grid.innerHTML = posts.map(p => `
        <a class="post-card" data-file="${p.file}">
            <div class="post-card-date">${p.date || ''}</div>
            <div class="post-card-title">${escapeHtml(p.title)}</div>
            <div class="post-card-desc">${escapeHtml(p.description || '')}</div>
            ${p.tags ? `<div class="post-card-tags">${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </a>
    `).join('');
}

// ========== 搜索过滤 ==========
export function filterPosts() {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!q) return renderPosts(state.allPosts);
    const filtered = state.allPosts.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
    renderPosts(filtered);
}
