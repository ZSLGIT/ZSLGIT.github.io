/* ============================================================
   utils.js - 工具函数
   ============================================================ */

// HTML 转义，防止注入 / 显示异常
export function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}
