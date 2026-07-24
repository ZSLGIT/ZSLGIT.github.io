# 欢迎来到 Z&L Blog

> 这是我的第一篇博客文章，记录一下这个博客的诞生。

## 关于这个博客

这是一个基于 **GitHub Pages** 的静态博客，使用纯 Markdown 编写文章。

### 技术栈

- **前端**: 纯 HTML + CSS + JavaScript（无框架依赖）
- **Markdown 渲染**: [marked.js](https://marked.js.org/)
- **代码高亮**: [highlight.js](https://highlightjs.org/)
- **托管**: GitHub Pages

## 如何添加新文章

1. 在 `posts/` 目录下创建 `.md` 文件
2. 在 `posts.json` 中添加对应的索引条目：

```json
{
  "title": "你的文章标题",
  "date": "2026-07-24",
  "file": "posts/your-post.md",
  "description": "简短描述",
  "tags": ["标签1", "标签2"]
}
```

3. 提交并推送到 GitHub 即可自动发布！

## 示例内容

下面是一些 Markdown 格式示例：

### 代码块

```javascript
function hello() {
    console.log("Hello, Z&L Blog!");
}
```

```python
def greet(name):
    return f"Hello, {name}!"
```

### 表格

| 功能 | 状态 |
|------|------|
| 文章列表 | ✅ |
| Markdown 渲染 | ✅ |
| 代码高亮 | ✅ |
| 搜索过滤 | ✅ |
| 响应式设计 | ✅ |

### 引用

> 保持简单，保持优雅。

---

*感谢访问！*
