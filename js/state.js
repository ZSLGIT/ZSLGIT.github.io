/* ============================================================
   state.js - 共享状态
   ES Module 下用单一对象保存可变状态，各模块 import 后读写其属性
   （避免跨模块重新赋值 import 绑定导致的只读错误）
   ============================================================ */

export const state = {
    allCategories: [],      // 真实分类列表（来自 tag.json）[{id,name,file}]
    displayCategories: [],  // 展示用分类：['全部', ...真实分类]
    categoryPostsMap: {},   // 各分类已加载的文章列表：id -> posts[]
    aggregatedPosts: [],    // 聚合后的全部文章（按 file 去重）
    currentCategory: null,  // 当前选中的分类
    allPosts: [],           // 当前分类下的文章列表
    inAppNav: false,        // 是否在本站内进行过导航，用于决定回退行为
};
