/* ============================================================
   data.js - 数据加载（分类 / 文章聚合）
   ============================================================ */

import { TAG_INDEX, ALL_CATEGORY } from './config.js';
import { state } from './state.js';
import { selectCategory, renderCategoryTabs } from './render.js';

// ========== 加载分类数据库 ==========
export async function loadCategories() {
    const grid = document.getElementById('postGrid');
    grid.innerHTML = '<div class="loading"><div class="spinner"></div><br>加载中...</div>';
    try {
        const res = await fetch(TAG_INDEX);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        state.allCategories = await res.json();
    } catch (e) {
        state.allCategories = [];
    }
    // 预加载所有分类文章并聚合出“全部”
    await loadAllCategoryPosts();
    state.displayCategories = [ALL_CATEGORY, ...state.allCategories];
    renderCategoryTabs();

    // 优先按 URL 指定分类，否则默认展示“全部”
    const m = location.hash.slice(1).match(/^\/cat\/(.+)$/);
    if (m) {
        const cat = state.displayCategories.find(c => c.id === decodeURIComponent(m[1]));
        if (cat) { selectCategory(cat); return; }
    }
    selectCategory(ALL_CATEGORY);
}

// 预加载所有分类文件并聚合（按 file 去重）
async function loadAllCategoryPosts() {
    state.categoryPostsMap = {};
    await Promise.all(state.allCategories.map(async (cat) => {
        try {
            const r = await fetch(cat.file);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const posts = await r.json();
            state.categoryPostsMap[cat.id] = Array.isArray(posts) ? posts : [];
        } catch (e) {
            state.categoryPostsMap[cat.id] = [];
        }
    }));
    const seen = new Set();
    state.aggregatedPosts = [];
    state.allCategories.forEach(cat => {
        (state.categoryPostsMap[cat.id] || []).forEach(p => {
            if (p && p.file && !seen.has(p.file)) {
                seen.add(p.file);
                state.aggregatedPosts.push(p);
            }
        });
    });
}
