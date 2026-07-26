/* ============================================================
   article.js - 文章阅读与视图切换
   ============================================================ */

import { state } from './state.js';
import { escapeHtml } from './utils.js';

// ========== 打开文章 ==========
export async function openPost(file) {
    showArticleView();
    document.getElementById('articleTitle').textContent = '';
    document.getElementById('articleMeta').textContent = '';
    document.getElementById('articleTags').innerHTML = '';
    document.getElementById('articleContent').innerHTML = '<div class="loading"><div class="spinner"></div><br>加载中...</div>';

    const post = state.allPosts.find(p => p.file === file);

    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let md = await res.text();

        // 渲染 Markdown
        marked.setOptions({
            highlight(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true,
        });

        const html = DOMPurify.sanitize(marked.parse(md));

        if (post) {
            document.getElementById('articleMeta').textContent = post.date || '';
            document.getElementById('articleTitle').textContent = post.title;
            if (post.tags && post.tags.length) {
                document.getElementById('articleTags').innerHTML =
                    post.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
            }
        } else {
            // 不在 posts.json 索引中的文章（如站内互链文档），用文件名兜底作标题
            document.getElementById('articleTitle').textContent =
                decodeURIComponent(file).split('/').pop().replace(/\.md$/i, '');
        }

        document.getElementById('articleContent').innerHTML = html;

        // 滚动到顶部（滚动容器为 .main）
        document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
        document.getElementById('articleContent').innerHTML =
            `<div class="empty-state"><p>文章加载失败<br><small>${escapeHtml(e.message)}</small></p></div>`;
    }
}

// ========== 视图切换 ==========
export function showArticleView() {
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('articleView').classList.add('active');
    document.getElementById('hero').style.display = 'none';
}
export function showListView() {
    document.getElementById('listView').classList.remove('hidden');
    document.getElementById('articleView').classList.remove('active');
    document.getElementById('hero').style.display = '';
}
export function goHome() {
    if (state.currentCategory) {
        location.hash = '#/cat/' + encodeURIComponent(state.currentCategory.id);
    } else {
        showListView();
    }
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
}

// 回退：已在本站导航则退回上一页（支持文章间回退），否则回到列表
export function goBack() {
    if (state.inAppNav && history.length > 1) {
        history.back();
    } else {
        goHome();
    }
}
