/* ============================================================
   router.js - 路由与站内导航
   ============================================================ */

import { state } from './state.js';
import { selectCategory } from './render.js';
import { openPost, showListView } from './article.js';

// ========== 站内导航（hash 路由） ==========
export function navigateToPost(file) {
    state.inAppNav = true;
    location.hash = '#/post/' + encodeURIComponent(file);
}

// ========== 路由（Hash） ==========
export function setupRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}

function handleRoute() {
    const hash = location.hash.slice(1); // 去掉 #
    if (!hash) { showListView(); return; }
    const cm = hash.match(/^\/cat\/(.+)$/);
    if (cm) {
        const cat = state.allCategories.find(c => c.id === decodeURIComponent(cm[1]));
        if (cat) { selectCategory(cat); return; }
    }
    const m = hash.match(/^\/post\/(.+)$/);
    if (m) { openPost(decodeURIComponent(m[1])); return; }
    showListView();
}
